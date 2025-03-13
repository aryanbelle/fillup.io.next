import mongoose from "mongoose";
import { ICreatorForm, ICreatorFormModel } from "./types";

const CreatorFormModel = new mongoose.Schema(
  {
    isAcceptingResponses: {
      type: Boolean,
      default: true,
    },
    creatorId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    questions: [
      {
        _id: false,
        type: {
          type: String,
          required: true,
        },
        isRequired: {
          type: Boolean,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CreatorForm = (mongoose.models.CreatorForm || 
  mongoose.model<ICreatorForm, ICreatorFormModel>("CreatorForm", CreatorFormModel)) as ICreatorFormModel;

export default CreatorForm; 