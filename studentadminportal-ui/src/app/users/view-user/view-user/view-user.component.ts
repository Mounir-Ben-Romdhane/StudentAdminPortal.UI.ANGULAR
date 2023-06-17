import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Claim } from 'src/app/models/api-models/claim.model';
import { Roles } from 'src/app/models/api-models/roles.model';
import { User } from 'src/app/models/ui-models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserStoreService } from 'src/app/services/user-store/user-store.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit{
  userId: string | null | undefined;
  user: User = {
    id: '',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    roleId: ''
  };
  isNewStudent = false;
  header = '';

  public myClaimsList: Array<string> = [];

  //Crud users
  public canReadUsers: boolean = false;
  public canUpdateUsers: boolean = false;
  public canDeleteUsers: boolean =false;
  public canAddUsers: boolean = false;

  //Crud students
  public canReadStudents: boolean = false;
  public canUpdateStudents: boolean = false;
  public canDeleteStudents: boolean =false;
  public canAddStudents: boolean = false;

  rolesList: Roles[] = [];
  @ViewChild('userDetailsForm') userDetailsForm?: NgForm;
  constructor(private readonly route: ActivatedRoute,
    private readonly apiService: ApiService,
    private toast: NgToastService,
    private router: Router,
    private userStore: UserStoreService,
    private auth: AuthService) {}

  ngOnInit(): void {



    this.userStore.getClaimsFromStore().
    subscribe(
      val => {
        let claimsFromToken = this.auth.getClaimsFromToken();
        this.myClaimsList = val || claimsFromToken;
        console.log("listClaims",this.myClaimsList);
        if(this.myClaimsList.includes("ReadUsers")){
          this.canReadUsers = true;
        }
        if(this.myClaimsList.includes("UpdateUsers")){
          this.canUpdateUsers = true;
        }
        if(this.myClaimsList.includes("DeleteUsers")){
          this.canDeleteUsers = true;
        }
        if(this.myClaimsList.includes("AddUsers")){
          this.canAddUsers = true;
        }
        if(this.myClaimsList.includes("ReadStudents")){
          this.canReadStudents = true;
        }
        if(this.myClaimsList.includes("UpdateStudents")){
          this.canUpdateStudents = true;
        }
        if(this.myClaimsList.includes("DeleteStudents")){
          this.canDeleteStudents = true;
        }
        if(this.myClaimsList.includes("AddStudents")){
          this.canAddStudents = true;
        }
      }
    )

    this.route.paramMap.subscribe(
      (params) => {
       this.userId = params.get('id');

       if(this.userId){
        if(this.userId.toLowerCase() === 'Add'.toLowerCase() ){
          // If the route contains the 'Add'
          // -> new Student Funtionality
          this.isNewStudent = true;
          this.header = 'Add New User';
        }else{
          //Otherwise
          // -> Existing student Funtionality
          this.isNewStudent = false;
          this.header = 'Edit User';
          this.apiService.getUser(this.userId)
          .subscribe(
            (succesRes) =>
            {
              this.user = succesRes;
              //console.log(succesRes);
              //console.log(this.user);
            },
            (errorRes) => {
              console.log(errorRes);
            }
        );


        }
        this.apiService.getRolesList()
        .subscribe(
          (succesRes) => {
            this.rolesList = succesRes;
          }
        );
       }
      }
    );

  }

  onUpdate(){
    if(this.userDetailsForm?.form.valid){
      // Submit from data to api
      //Call student Service to update user
      this.apiService.updateUser(this.user.id,this.user)
      .subscribe(
        (seccussRes) => {
          //show a notif
          this.toast.success({detail:"SUCCESS", summary:"User updated successfully !", duration:3000});

          setTimeout(() => {
            this.router.navigateByUrl('Users');
          }, 1000);
        },
        (errorRes) => {
          console.log(errorRes);
          this.toast.error({detail:"ERROR", summary:"Invalid Details! Please check your inputs !", duration:3000});
        }
      );
    }
  }

  onDelete(): void {
     //Call student Service to delete Student
     this.apiService.deleteUser(this.user.id)
     .subscribe(
       (seccussRes) => {
         //show a notif
         this.toast.success({detail:"SUCCESS", summary:"User deleted successfully !", duration:3000});

           setTimeout(() => {
             this.router.navigateByUrl('Users');
           }, 1000);


       },
       (errorRes) => {
         console.log(errorRes);
         this.toast.error({detail:"ERROR", summary:"Something is wrong !", duration:3000});
         }
     );
  }

  onAdd() {

    if(this.userDetailsForm?.form.valid){
      // Submit from data to api
      this.apiService.addUser(this.user)
      .subscribe(
        (seccussRes) => {
          //show a notif
          this.toast.success({detail:"SUCCESS", summary:"User Added successfully !", duration:3000});


            setTimeout(() => {
              this.router.navigateByUrl('Users');
            }, 1000);

        },
        (errorRes) => {
          console.log(this.user);
          console.log(errorRes);
          this.toast.error({detail:"ERROR", summary:"Invalid Details! Please check your inputs", duration:3000});
          /*this.snakBar.open('Invalid Details! Please check your inputs','Error',{
            duration: 2000
          });*/
        }
      );
    }else{
      this.toast.error({detail:"ERROR", summary:"Your form is invalid !", duration:2000});
    }

  }
}
