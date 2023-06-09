import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute } from '@angular/router';
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
  }

  genderList: Gender[] = [];

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snakBar: MatSnackBar) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
       this.studentId = params.get('id');

       if(this.studentId){
        this.studentService.getStudent(this.studentId)
          .subscribe(
            (succesRes) =>
            {
              this.student = succesRes;
            }
        );
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

}
