import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from './student.service';
import { Student } from '../models/ui-models/student.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../services/auth/auth.service';
import { UserStoreService } from '../services/user-store/user-store.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit{

  students: Student[] = [];
  displayedColumns: string[] = ['firstName','lastName','dateofBirth','email','mobile',
  'gender','edit'];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  filterString = '';
  public role!:string;

   constructor(private studentService: StudentService,
    private auth: AuthService,
    private userStore: UserStoreService) {}

   ngOnInit(): void {

    this.userStore.getRoleFromStore()
        .subscribe(val => {
          const roleFromToken = this.auth.getRoleFromToken();
          this.role = val || roleFromToken;
        });

    //fetch Students
    this.studentService.getStudents().subscribe(
        (succesResponce) => {
          this.students = succesResponce;
          console.log(succesResponce);
          this.dataSource = new MatTableDataSource<Student>(this.students);

          if(this.matPaginator){
            this.dataSource.paginator = this.matPaginator;
          }

          if(this.matSort) {
            this.dataSource.sort = this.matSort;
          }

        },
        (errorResponce) => {
          console.log(errorResponce);
        }
    );
   }

   filterStudents(){
    this.dataSource.filter = this.filterString.trim().toLowerCase();
   }



}
