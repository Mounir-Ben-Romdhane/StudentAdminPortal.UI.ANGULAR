import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPassword } from 'src/app/models/api-models/reset-password.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  private baseApiUrl = environment.baseApiUrl;

constructor(private http: HttpClient) { }

sendResetpasswordLink(email: string){
  return this.http.post<any>(this.baseApiUrl+ '/User/send-reset-email/' + email,{});
}

resetPassword(resetPasswordObj: ResetPassword){
  return this.http.post<any>(this.baseApiUrl+'/User/reset-password',resetPasswordObj);
}

}
