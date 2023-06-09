import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

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

  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snakBar: MatSnackBar,
    private router: Router) {}

  ngOnInit(): void {
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
          this.snakBar.open('Student updated successfully','Done',{
            duration: 2000
          });
        },
        (errorRes) => {
          console.log(errorRes);
          this.snakBar.open('Invalid Details! Please check your inputs','Error',{
            duration: 2000
          });
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
        this.snakBar.open('Student deleted successfully','Done',{
          duration: 2000
          });

          setTimeout(() => {
            this.router.navigateByUrl('Students');
          }, 2000);


      },
      (errorRes) => {
        console.log(errorRes);
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
          this.snakBar.open('Student added successfully',undefined,{
            duration: 2000
            });

            setTimeout(() => {
              this.router.navigateByUrl('Students');
            }, 2000);

        },
        (errorRes) => {
          console.log(errorRes);
          this.snakBar.open('Invalid Details! Please check your inputs','Error',{
            duration: 2000
          });
        }
      );
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

          //show a notif
        this.snakBar.open('Profile image successfully','Done',{
          duration: 2000
          });
        },
        (errorRes) => {
          console.log(errorRes);
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
