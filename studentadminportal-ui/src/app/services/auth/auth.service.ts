import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/api-models/user.model';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt'
import { TokenApiModel } from 'src/app/models/api-models/token-api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseApiUrl:string = environment.baseApiUrl;
  private userPayload:any;

  constructor(private http: HttpClient,
    private router: Router
    ) {
      this.userPayload = this.decodeToken();
     }

  signUp(userObj: any){
    return this.http.post<any>(this.baseApiUrl + "/User/register",userObj);
  }

  login(loginOnj: any){
    return this.http.post<any>(this.baseApiUrl + "/User/authenticate",loginOnj);
  }

  signOut(){
    localStorage.clear();
    this.router.navigateByUrl('login');
    //localStorage.removeItem('token');
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token',tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshToken',tokenValue);
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token')
  }

  decodeToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  getFullNameFromToken(){
    if(this.userPayload)
      return this.userPayload.unique_name;
  }

  getRoleFromToken(){
    if(this.userPayload)
      return this.userPayload.role;
  }

  getClaimsFromToken(){
    if(this.userPayload)
      return this.userPayload.myClaims;
  }

  renewToken(tokenApi: TokenApiModel){
    return this.http.post<any>(this.baseApiUrl + "/User/refresh",tokenApi);
  }

}
