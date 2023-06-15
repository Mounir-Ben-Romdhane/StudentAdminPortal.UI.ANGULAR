import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient ) { }

  getUsers(){
    return this.http.get<any>(this.baseApiUrl+ '/Users');
  }
}
