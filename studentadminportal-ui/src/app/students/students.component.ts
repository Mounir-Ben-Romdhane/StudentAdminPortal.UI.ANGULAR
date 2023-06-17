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

   constructor(private studentService: StudentService,
    private auth: AuthService,
    private userStore: UserStoreService) {}

   ngOnInit(): void {

    this.userStore.getRoleFromStore()
        .subscribe(val => {
          const roleFromToken = this.auth.getRoleFromToken();
          this.role = val || roleFromToken;
        });

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
            //console.log("canReadUser",this.canReadUsers);
            //console.log("canUpdateUser",this.canUpdateUsers);
            //console.log("canDeleteUser",this.canDeleteUsers);
            //console.log("canReadStudents",this.canReadStudents);
            //console.log("canUpdateStudents",this.canUpdateStudents);
            //console.log("canDeleteStudents",this.canDeleteStudents);
          }
        )

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
