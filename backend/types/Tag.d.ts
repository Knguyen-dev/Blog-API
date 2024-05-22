import { Types, Model, Document } from "mongoose";
export interface ITag {
  title: string;
  slug: string;
  lastUpdatedBy: Types.ObjectId;
}

export interface ITagDoc extends ITag, Document {}

export interface ITagModel extends Model<ITagDoc> {
  checkTags(tagIDs: string[])
}
