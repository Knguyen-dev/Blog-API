import { Types, Model, Model } from "mongoose";

// Raw object interface
export interface ICategory {
  title: string;
  description: string;
  slug: string;
  lastUpdatedBy:  Types.ObjectId;
}

// Represents the Category object returned by mongoose find functions
export interface ICategoryDoc extends ICategory, Document {}

// Model
export type ICategoryModel = Model<ICategory>;