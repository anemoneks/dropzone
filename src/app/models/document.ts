import { IDocument } from "../interfaces/i-document";

export class Document implements IDocument {
  constructor(document: IDocument = null) {
    this._id = document?._id || null;
    this.title = document?.title || null;
    this.filename = document?.filename || null
    this.attachment = document?.attachment || null;
    this.documentType = document?.documentType || null;
    this.createdBy = document?.createdBy || null;
    this.createdDate = document?.createdDate || null;
    this.updatedBy = document?.updatedBy || null;
    this.updatedDate = document?.updatedDate || null;
  }

  _id: string;
  title: string;
  filename: string;
  attachment: string;
  documentType: DocumentType;
  createdBy: string;
  createdDate: Date;
  updatedBy: string;
  updatedDate: Date;
}
