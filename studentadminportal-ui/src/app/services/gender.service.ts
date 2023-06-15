import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gender } from '../models/api-models/gender.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(private httpClient : HttpClient ) { }

getGenderList(): Observable<Gender[]>{
  return this.httpClient.get<Gender[]>(this.baseApiUrl + '/Genders');
}

}
