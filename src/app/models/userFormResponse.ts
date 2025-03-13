import mongoose from "mongoose";
import { IUserFormResponse, IUserFormResponseModel } from "./types";

const UserFormResponseModel = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
      },
      answer_type: {
        type: String,
        required: true,
      },
    },
  ],
}, {
  timestamps: true
});

UserFormResponseModel.index({ userId: 1, formId: 1 }, { unique: true });

const UserFormResponse = (mongoose.models.UserFormResponse ||
  mongoose.model<IUserFormResponse, IUserFormResponseModel>("UserFormResponse", UserFormResponseModel)) as IUserFormResponseModel;

export default UserFormResponse; 