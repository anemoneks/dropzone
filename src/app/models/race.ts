import { IRace } from "../interfaces/i-race";

export class Race implements IRace {
  constructor(race: IRace = null) {
    this._id = race?._id || null;
    this.name = race?.name || null;
  }

  _id: string;
  name: string;
}
