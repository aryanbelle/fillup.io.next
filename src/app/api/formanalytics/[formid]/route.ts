import { currentUser } from "@clerk/nextjs/server";
import { decrypt } from "@/app/lib/crypto";
import dbConnect from "@/app/lib/dbConnect";
import CreatorForm from "@/app/models/creatorForm";
import UserFormResponse from "@/app/models/userFormResponse";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const supportedTypes = new Set(["number", "date", "radio", "checkbox"]);

function asDate(value: unknown): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value).replace(/\//g, "-"));
  return Number.isNaN(date.getTime()) ? null : date;
}

function bucketDates(daily: Array<{ _id: string; count: number }>) {
  if (!daily.length) return [];
  const first = new Date(daily[0]._id);
  const last = new Date(daily[daily.length - 1]._id);
  const spanDays = Math.max(1, Math.ceil((last.getTime() - first.getTime()) / 86400000) + 1);
  const unit = spanDays <= 90 ? "day" : spanDays <= 730 ? "week" : "month";
  const bins = new Map<string, { label: string; count: number; lower: string; upper: string }>();
  for (const item of daily) {
    const date = new Date(`${item._id}T00:00:00.000Z`);
    const start = new Date(date);
    if (unit === "week") {
      const day = (start.getUTCDay() + 6) % 7;
      start.setUTCDate(start.getUTCDate() - day);
    } else if (unit === "month") {
      start.setUTCDate(1);
    }
    const key = start.toISOString().slice(0, 10);
    const end = new Date(start);
    if (unit === "week") end.setUTCDate(end.getUTCDate() + 6);
    if (unit === "month") end.setUTCMonth(end.getUTCMonth() + 1, 0);
    const label = unit === "month" ? start.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }) :
      unit === "week" ? `${start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}` :
      start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
    const existing = bins.get(key);
    if (existing) existing.count += item.count;
    else bins.set(key, { label, count: item.count, lower: key, upper: end.toISOString().slice(0, 10) });
  }
  return Array.from(bins.values());
}

async function getQuestionAnalytics(formId: mongoose.Types.ObjectId, definition: any, index: number, totalResponses: number) {
  const type = definition.type as string;
  const identity = { formId };
  const pipeline: any[] = [
    { $match: identity },
    { $unwind: { path: "$questions", includeArrayIndex: "questionIndex" } },
    { $match: { questionIndex: index, "questions.answer_type": type } },
    { $project: {
      answer: { $ifNull: ["$questions.answer", ""] },
      answerValues: "$questions.answerValues",
      answerNumber: "$questions.answerNumber",
      answerDate: "$questions.answerDate",
    } },
  ];

  if (type === "radio") {
    const [result] = await UserFormResponse.aggregate([
      ...pipeline,
      { $facet: {
        summary: [{ $group: { _id: null, answered: { $sum: { $cond: [{ $ne: ["$answer", ""] }, 1, 0] } } } }],
        values: [
          { $match: { answer: { $ne: "" } } },
          { $group: { _id: "$answer", count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
        ],
      } },
    ]);
    const counts = new Map<string, number>((result?.values ?? []).map((item: any) => [item._id, item.count] as [string, number]));
    const options = Array.from(new Set([...(definition.options ?? []), ...Array.from(counts.keys()).filter((value) => !definition.options?.includes(value))]));
    const answered = result?.summary?.[0]?.answered ?? 0;
    return {
      questionId: definition.questionId ?? `legacy-${index}`, index, question: definition.text, type,
      options: definition.options ?? [], answered, skipped: Math.max(0, totalResponses - answered), valid: answered, invalid: 0,
      distribution: options.map((value) => ({ label: value, count: counts.get(value) ?? 0, percentage: answered ? ((counts.get(value) ?? 0) / answered) * 100 : 0 })),
    };
  }

  if (type === "checkbox") {
    const [result] = await UserFormResponse.aggregate([
      ...pipeline,
      { $addFields: { selections: { $setUnion: [
        { $cond: [{ $isArray: "$answerValues" }, "$answerValues", { $cond: [{ $ne: ["$answer", ""] }, { $split: ["$answer", ", "] }, []] }] },
        [],
      ] } } },
      { $facet: {
        summary: [{ $group: {
          _id: null,
          answered: { $sum: { $cond: [{ $gt: [{ $size: "$selections" }, 0] }, 1, 0] } },
        } }],
        values: [
          { $unwind: "$selections" },
          { $group: { _id: "$selections", count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
        ],
      } },
    ]);
    const counts = new Map<string, number>((result?.values ?? []).map((item: any) => [item._id, item.count] as [string, number]));
    const options = Array.from(new Set([...(definition.options ?? []), ...Array.from(counts.keys()).filter((value) => !definition.options?.includes(value))]));
    const answered = result?.summary?.[0]?.answered ?? 0;
    return {
      questionId: definition.questionId ?? `legacy-${index}`, index, question: definition.text, type,
      options: definition.options ?? [], answered, skipped: Math.max(0, totalResponses - answered), valid: answered, invalid: 0,
      distribution: options.map((value) => ({ label: value, count: counts.get(value) ?? 0, percentage: answered ? ((counts.get(value) ?? 0) / answered) * 100 : 0 })),
    };
  }

  if (type === "number") {
    const [result] = await UserFormResponse.aggregate([
      ...pipeline,
      { $addFields: { value: { $ifNull: ["$answerNumber", { $convert: { input: "$answer", to: "double", onError: null, onNull: null } }] } } },
      { $facet: {
        summary: [{ $group: { _id: null, answered: { $sum: { $cond: [{ $ne: ["$answer", ""] }, 1, 0] } }, valid: { $sum: { $cond: [{ $ne: ["$value", null] }, 1, 0] } }, average: { $avg: "$value" }, min: { $min: "$value" }, max: { $max: "$value" } } }],
        distribution: [
          { $match: { value: { $ne: null } } },
          { $bucketAuto: { groupBy: "$value", buckets: 8, output: { count: { $sum: 1 }, lower: { $min: "$value" }, upper: { $max: "$value" } } } },
          { $sort: { _id: 1 } },
        ],
      } },
    ]);
    const summary = result?.summary?.[0] ?? {};
    return {
      questionId: definition.questionId ?? `legacy-${index}`, index, question: definition.text, type,
      options: [], answered: summary.answered ?? 0, skipped: Math.max(0, totalResponses - (summary.answered ?? 0)),
      valid: summary.valid ?? 0, invalid: Math.max(0, (summary.answered ?? 0) - (summary.valid ?? 0)),
      average: summary.average ?? null, min: summary.min ?? null, max: summary.max ?? null,
      distribution: (result?.distribution ?? []).map((item: any) => ({
        label: item.lower === item.upper ? String(item.lower) : `${item.lower} – ${item.upper}`,
        count: item.count, lower: item.lower, upper: item.upper,
      })),
    };
  }

  const [result] = await UserFormResponse.aggregate([
    ...pipeline,
    { $addFields: { value: { $ifNull: ["$answerDate", { $dateFromString: { dateString: { $replaceAll: { input: "$answer", find: "/", replacement: "-" } }, onError: null, onNull: null } }] } } },
    { $facet: {
      summary: [{ $group: { _id: null, answered: { $sum: { $cond: [{ $ne: ["$answer", ""] }, 1, 0] } }, valid: { $sum: { $cond: [{ $ne: ["$value", null] }, 1, 0] } }, earliest: { $min: "$value" }, latest: { $max: "$value" } } }],
      daily: [
        { $match: { value: { $ne: null } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$value", timezone: "UTC" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ],
    } },
  ]);
  const summary = result?.summary?.[0] ?? {};
  const daily = result?.daily ?? [];
  return {
    questionId: definition.questionId ?? `legacy-${index}`, index, question: definition.text, type,
    options: [], answered: summary.answered ?? 0, skipped: Math.max(0, totalResponses - (summary.answered ?? 0)),
    valid: summary.valid ?? 0, invalid: Math.max(0, (summary.answered ?? 0) - (summary.valid ?? 0)),
    earliest: summary.earliest ? asDate(summary.earliest)?.toISOString() : null,
    latest: summary.latest ? asDate(summary.latest)?.toISOString() : null,
    distribution: bucketDates(daily),
  };
}

export async function GET(_request: Request, { params }: { params: { formid: string } }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized user" }, { status: 401 });
    const formId = decrypt(params.formid);
    if (!mongoose.isValidObjectId(formId)) return NextResponse.json({ success: false, message: "Invalid form link." }, { status: 400 });
    await dbConnect();
    const form = await CreatorForm.findById(formId).lean();
    if (!form) return NextResponse.json({ success: false, message: "Form not found." }, { status: 404 });
    if (form.creatorId !== user.id) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    const totalResponses = await UserFormResponse.countDocuments({ formId });
    const available = (await Promise.all(form.questions.map((definition: any, index: number) =>
      supportedTypes.has(definition.type)
        ? getQuestionAnalytics(new mongoose.Types.ObjectId(formId), definition, index, totalResponses)
        : Promise.resolve(null),
    ))).filter(Boolean);
    return NextResponse.json({
      success: true,
      data: {
        title: form.title,
        description: form.description,
        totalResponses,
        supportedQuestionCount: available.length,
        unsupportedQuestionCount: form.questions.length - available.length,
        questions: available,
      },
    });
  } catch (error: any) {
    console.error("Error computing form analytics:", error);
    if (["ENOTFOUND", "ECONNREFUSED", "EAI_AGAIN"].includes(error.code) || /MongoServerSelectionError|MongooseServerSelectionError/.test(error.name ?? "")) {
      return NextResponse.json({ success: false, message: "Analytics are temporarily unavailable. Please try again." }, { status: 503 });
    }
    return NextResponse.json({ success: false, message: "Could not load form analytics." }, { status: 500 });
  }
}
