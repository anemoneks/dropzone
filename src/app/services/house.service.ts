import { Observable } from 'rxjs';
import { IHouse } from '../interfaces/i-house';
import { IBill } from '../interfaces/i-bill';
import { IDocument } from '../interfaces/i-document';

export abstract class HouseService {
  housesUrl = 'http://localhost:8083/api/houses';  // URL to web api

  abstract getHouses(): Observable<IHouse[]>;
  abstract getHouse(id: string): Observable<IHouse>;
  abstract addHouse(house: IHouse): Observable<IHouse>;
  abstract deleteHouse(house: IHouse | string): Observable<IHouse>;
  abstract searchHouses(term: string): Observable<IHouse[]>;
  abstract updateHouse(house: IHouse): Observable<IHouse>;
  abstract addDocuments(documents: IDocument[]): Observable<IHouse>;
}
