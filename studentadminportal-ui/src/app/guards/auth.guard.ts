import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { NgToastService } from "ng-angular-popup";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private auth: AuthService,
    private router: Router,
    private toast: NgToastService){}

  canActivate():boolean{
    if(this.auth.isLoggedIn()){
      //this.router.navigateByUrl('Students');
      return true;
    }else{
      this.toast.error({detail:"ERROR", summary:"Please login in first !", duration:3000});
      this.router.navigateByUrl('login');
      return false;
    }
  }


}

