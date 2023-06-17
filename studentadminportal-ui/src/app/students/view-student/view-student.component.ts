import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserStoreService } from 'src/app/services/user-store/user-store.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateofBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  };
  isNewStudent = false;
  header = '';
  displayProfileImageUrl= '';


  genderList: Gender[] = [];
  public role!:string;
  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;

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

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snakBar: MatSnackBar,
    private router: Router,
    private toast: NgToastService,
    private auth: AuthService,
    private userStore: UserStoreService) {}

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

    this.userStore.getRoleFromStore()
        .subscribe(val => {
          const roleFromToken = this.auth.getRoleFromToken();
          this.role = val || roleFromToken;
        });

    this.route.paramMap.subscribe(
      (params) => {
       this.studentId = params.get('id');

       if(this.studentId){
        if(this.studentId.toLowerCase() === 'Add'.toLowerCase() ){
          // If the route contains the 'Add'
          // -> new Student Funtionality
          this.isNewStudent = true;
          this.header = 'Add New Student';
          this.setImage();
        }else{
          //Otherwise
          // -> Existing student Funtionality
          this.isNewStudent = false;
          this.header = 'Edit Student';
          this.studentService.getStudent(this.studentId)
          .subscribe(
            (succesRes) =>
            {
              this.student = succesRes;
              this.setImage();
            },
            (errorRes) => {
              this.setImage();
            }
        );
        }
        this.genderService.getGenderList()
        .subscribe(
          (succesRes) => {
            this.genderList = succesRes;
          }
        );
       }
      }
    );

  }

  onUpdate(): void{
    if(this.studentDetailsForm?.form.valid){
      // Submit from data to api
      //Call student Service to update Student
      this.studentService.updateStudent(this.student.id,this.student)
      .subscribe(
        (seccussRes) => {
          //show a notif
          this.toast.success({detail:"SUCCESS", summary:"Student updated successfully !", duration:3000});
          /*this.snakBar.open('Student updated successfully','Done',{
            duration: 2000
          });*/

          setTimeout(() => {
            this.router.navigateByUrl('Students');
          }, 1000);
        },
        (errorRes) => {
          console.log(errorRes);
          this.toast.error({detail:"ERROR", summary:"Invalid Details! Please check your inputs !", duration:3000});
          /*this.snakBar.open('Invalid Details! Please check your inputs','Error',{
            duration: 2000
          });*/
        }
      );
    }
  }

  onDelete(): void {
    //Call student Service to delete Student
    this.studentService.deleteStudent(this.student.id)
    .subscribe(
      (seccussRes) => {
        //show a notif
        this.toast.success({detail:"SUCCESS", summary:"Student deleted successfully !", duration:3000});
        /*this.snakBar.open('Student deleted successfully','Done',{
          duration: 2000
          });
          */
          setTimeout(() => {
            this.router.navigateByUrl('Students');
          }, 1000);


      },
      (errorRes) => {
        console.log(errorRes);
        this.toast.error({detail:"ERROR", summary:"Something is wrong !", duration:3000});
        }
    );
  }

  onAdd(): void{

    if(this.studentDetailsForm?.form.valid){
      // Submit from data to api
      this.studentService.addStudent(this.student)
      .subscribe(
        (seccussRes) => {
          //show a notif
          this.toast.success({detail:"SUCCESS", summary:"Student Added successfully !", duration:3000});
          /*this.snakBar.open('Student added successfully',undefined,{
            duration: 2000
            });*/

            setTimeout(() => {
              this.router.navigateByUrl('Students');
            }, 1000);

        },
        (errorRes) => {
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

  uploadImage(event: any): void {
    if(this.studentId){
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id,file)
      .subscribe(
        (seccusRes) => {
          this.student.profileImageUrl = seccusRes;
          this.setImage();
          this.toast.success({detail:"SUCCESS", summary:"Profile image updated successfully !", duration:3000});
          //show a notif
        /*this.snakBar.open('Profile image successfully','Done',{
          duration: 2000
          });*/
        },
        (errorRes) => {
          console.log(errorRes);
          this.toast.error({detail:"ERROR", summary:"Something is wrong !", duration:3000});
        }
      );
    }
  }

  private setImage(): void{
    if(this.student.profileImageUrl){
      // fetch the image by ulr
      this.displayProfileImageUrl = this.studentService.getImagePath(
        this.student.profileImageUrl
      );
    }else{
      // Display a default
      this.displayProfileImageUrl = '/assets/user.png';
    }
  }

}
