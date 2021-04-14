import { IHouse } from "../interfaces/i-house";
import { IMessage } from "../interfaces/i-message";
import { IUser } from "../interfaces/i-user";

export class Message implements IMessage {
  constructor(message: IMessage = null) {
    this._id = message?._id || null;
    this.house = message?.house || null;
    this.subject = message?.subject || null;
    this.body = message?.body || null;
    this.unread = message?.unread || null;
    this.createdBy = message?.createdBy || null;
    this.createdDate = message?.createdDate || null;
    this.updatedBy = message?.updatedBy || null;
    this.updatedDate = message?.updatedDate || null;
  }

  _id: string;
  house: IHouse;
  subject: string;
  body: string;
  unread: Boolean;
  createdBy: IUser;
  createdDate: Date;
  updatedBy: IUser;
  updatedDate: Date;
  releasedDate: Date;
}
