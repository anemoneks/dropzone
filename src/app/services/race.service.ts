import { Observable } from 'rxjs';
import { IRace } from '../interfaces/i-race';

export abstract class RaceService {
  racesUrl = 'http://localhost:8083/api/races';  // URL to web api

  abstract getRaces(): Observable<IRace[]>;
  abstract getRace(id: string): Observable<IRace>;
  abstract addRace(race: IRace): Observable<IRace>;
  abstract deleteRace(race: IRace | string): Observable<IRace>;
  abstract updateRace(race: IRace): Observable<IRace>;
}
