import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmPasswordValidators } from 'src/app/helpers/confirm-password.validator';
import ValidateForm from 'src/app/helpers/validateform';
import { ResetPassword } from 'src/app/models/api-models/reset-password.model';
import { ResetPasswordService } from 'src/app/services/reset-password/reset-password.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private resetService: ResetPasswordService,
    private toast: NgToastService,
    private router: Router){}

  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();
  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    },{
      validator: ConfirmPasswordValidators("password","confirmPassword")
    });
    this.activatedRoute.queryParams.subscribe(
      val => {
        this.emailToReset = val['email'];
        let uriToken = val['code'];

        this.emailToken = uriToken.replace(/ /g,'+');
        console.log(this.emailToReset);
        console.log(this.emailToken);
      }
    )
  }

  reset(){
    //check is the form is valid
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this;this.resetPasswordObj.emailToken = this.emailToken;

      this.resetService.resetPassword(this.resetPasswordObj).subscribe({
        next:(res)=>{
          this.toast.success(
            {detail:"SUCCESS", summary:"Password Reset successfully !", duration:3000});
            this.router.navigateByUrl('/');
        },
        error:(err)=>{
          this.toast.error({detail:"ERROR", summary:"Something went wrong !", duration:2000});
        }
      })

    }else{
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
}

}
