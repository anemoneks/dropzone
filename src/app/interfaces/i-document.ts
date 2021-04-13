export interface IDocument {
  _id: string;
  title: string;
  filename: string;
  attachment: string;
  documentType: DocumentType;
  releasedDate: Date;
  createdBy: string;
  createdDate: Date;
  updatedBy: string;
  updatedDate: Date;
}
