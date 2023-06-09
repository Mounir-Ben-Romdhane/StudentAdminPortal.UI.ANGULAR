import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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


  genderList: Gender[] = [];

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
      }
    );
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
      }
    );
  }

}
