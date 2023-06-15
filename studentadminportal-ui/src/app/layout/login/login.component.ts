import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserStoreService } from 'src/app/services/user-store/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  type: string = "password";
  istext: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private snakBar: MatSnackBar,
    private toast: NgToastService,
    private userStore: UserStoreService){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required ]
    })
  }

  onLogin(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
      this.auth.login(this.loginForm.value).subscribe(
        (seccussRes) => {
          /*this.snakBar.open('Login successfully','Done',{
            duration: 2000
          });*/
          this.loginForm.reset();
          this.auth.storeToken(seccussRes.accessToken);
          this.auth.storeRefreshToken(seccussRes.refreshToken);
          const tokenPayload = this.auth.decodeToken();
          this.userStore.setFullNameFromStore(tokenPayload.unique_name);
          this.userStore.setRoleFromStore(tokenPayload.role);
          this.userStore.setClaimsFromStore(tokenPayload.myClaims);
          this.toast.success({detail:"SUCCESS", summary:"Login successfully !", duration:3000});
          this.router.navigateByUrl('Dashboard');
          console.log(seccussRes);
        },
        (errorRes) => {
          console.log(errorRes);
          this.toast.error({detail:"ERROR", summary:errorRes.error.message, duration:3000});
          /*this.snakBar.open(errorRes.error.message,'Error',{
            duration: 2000
          });
          console.log(this.loginForm.value);*/
        }
      );
      /*if(this.loginForm.value.username == "admin" && this.loginForm.value.password == "admin"){
        this.router.navigateByUrl('Students');
      }else{
        alert("User not exist !")
      }*/
      // Send the object to data base
    }else{
      // Throw the error using toester and with required file

      ValidateForm.validateAllFormFields(this.loginForm);
      this.toast.error({detail:"ERROR", summary:"Your form is invalid !", duration:2000});
      /*this.snakBar.open("Your form is invalid !",'Error',{
        duration: 2000
      });*/
    }
  }

  hideShowPass(){
    this.istext = !this.istext;
    this.istext ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.istext ? this.type = "text" : this.type = "password";
  }


}
