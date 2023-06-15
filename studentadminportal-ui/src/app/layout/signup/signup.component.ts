import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

  type: string = "password";
  istext: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  signUpForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snakBar: MatSnackBar,
    private toast: NgToastService){}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstname: ['',Validators.required],
      lastname: ['',Validators.required],
      email: ['',Validators.required],
      username: ['',Validators.required],
      password: ['',Validators.required ]
    })
  }

  onSignUp(){
    if(this.signUpForm.valid){
      console.log(this.signUpForm.value);
      // Sing Up
      this.auth.signUp(this.signUpForm.value).subscribe(
        (seccussRes) => {
          this.signUpForm.reset();
          /*
          this.snakBar.open('Account created successfully','Done',{
            duration: 2000
          });
          */
          this.toast.success({detail:"SUCCESS", summary:"Account created successfully !", duration:3000});
          this.router.navigateByUrl('login');
        },
        (errorRes) => {
          console.log(errorRes);
          this.toast.error({detail:"ERROR", summary:errorRes.error, duration:3000});
          /*this.snakBar.open(errorRes.error,'Error',{
            duration: 2000
          });*/
        }
      );

    }else{
      // Throw the error using toester and with required file

      ValidateForm.validateAllFormFields(this.signUpForm);
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
