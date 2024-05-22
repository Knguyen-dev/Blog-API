import { Types, Model, Document } from "mongoose";

// Interface for raw post in the database
export interface IPost {
  user: Types.ObjectId;
  title: string;
  slug: string;
  body: string;
  isPublished: boolean;
  category: Types.ObjectId;
  tags: Types.ObjectId[]
  imgSrc: string;
  imgCredits: string;
  status: string;
  wordCount: number;
  lastUpdatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Post object that's returned by mongoose functions
export interface IPostDoc extends IPost, Document {

  // Should contain instance methods and virtuals, if any
  updatePost(
    title: string, 
    body: string, 
    categoryID: string, 
    tagIDs: string[], 
    imgSrc: string,
    imgCredits: string, 
    status: string, 
    wordCount: number, 
    userID: string
  ): Promise<void>;
  
  updateStatus(
    status: string, 
    userID: string
  ): Promise<void>;
}

// Model
export interface IPostModel extends Model<IPostDoc> {
  checkTitleAndSlug(title: string, slug: string, id: string | null = null): Promise<void>;
  checkCategory(categoryID: string): Promise<void>;
  checkTags(tagIDs: string[]): Promise<void>;
  createPost(
    title: string, 
    body: string, 
    categoryID: string, 
    tagIDs: string[], 
    imgSrc: string, 
    imgCredits: string, 
    status: string, 
    wordCount: number, 
    userID: string
  ): Promise<IPostDoc>;
}


// Instance methods
// export interface IPostMethods {
//   updatePost(
//     title: string, 
//     body: string, 
//     categoryID: string, 
//     tagIDs: string[], 
//     imgSrc: string, 
//     imgCredits: string, 
//     status: string, 
//     wordCount: number, 
//     userID: string
//   ): Promise<void>,
//   updateStatus(status: string, userID: string): Promise<void>,
// }

// Interface for the model, contains both instance and static methods
// export interface IPostModel extends Model<IPost, {}, IPostMethods> {
//   // Static methods
//   checkTitleAndSlug(title: string, slug: string, id: string | null): Promise<void>;
//   checkCategory(categoryID: string): Promise<void>;
//   checkTags(tagIDs: string[]): Promise<void>;
//   createPost(
//     title: string, 
//     body: string, 
//     categoryID: string, 
//     tagIDs: string[], 
//     imgSrc: string, 
//     imgCredits: string, 
//     status: string, 
//     wordCount: number, 
//     userID: string
//   ): Promise<HydratedDocument<IPost>>;
// }


