import { Document, Model } from 'mongoose';

// CreatorForm interfaces
export interface IQuestion {
  type: string;
  isRequired: boolean;
  text: string;
  options: string[];
}

export interface ICreatorForm extends Document {
  isAcceptingResponses: boolean;
  creatorId: string;
  title: string;
  description: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatorFormModel extends Model<ICreatorForm> {
  // Add any static methods here if needed
}

// UserFormResponse interfaces
export interface IFormQuestion {
  question: string;
  answer: string;
  answer_type: string;
}

export interface IUserFormResponse extends Document {
  userId: string;
  formId: string;
  title: string;
  description: string;
  questions: IFormQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserFormResponseModel extends Model<IUserFormResponse> {
  // Add any static methods here if needed
} 