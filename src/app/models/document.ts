import { IDocument } from "../interfaces/i-document";

export class Document implements IDocument {
  constructor(document: IDocument = null) {
    this._id = document._id;
    this.title = document.title;
    this.attachment = document.attachment;
    this.createdBy = document.createdBy;
    this.createdDate = document.createdDate;
    this.updatedBy = document.updatedBy;
    this.updatedDate = document.updatedDate;
  }

  _id: string;
  title: string;
  attachment: string;
  createdBy: string;
  createdDate: Date;
  updatedBy: string;
  updatedDate: Date;
}
