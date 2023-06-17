import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/ui-models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserStoreService } from 'src/app/services/user-store/user-store.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public users:any =[];
  displayedColumns: string[] = ['firstName','lastName','userName','email','role',
  'privileges','edit'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();

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

  constructor(private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService){}

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

    this.api.getUsers().subscribe(
      (seccussRes) => {
        this.users = seccussRes;
        console.log(this.users);
        this.dataSource = new MatTableDataSource<User>(this.users);

        if(this.matPaginator){
          this.dataSource.paginator = this.matPaginator;
        }

        if(this.matSort) {
          this.dataSource.sort = this.matSort;
        }
      },
      (errorRes) => {
        console.log(errorRes);

      }
    );
  }
  filterStudents(){
    this.dataSource.filter = this.filterString.trim().toLowerCase();
   }

}
