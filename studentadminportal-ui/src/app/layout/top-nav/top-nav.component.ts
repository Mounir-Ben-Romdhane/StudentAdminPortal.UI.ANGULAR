import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserStoreService } from 'src/app/services/user-store/user-store.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  public fullName : string ="";
  public role!:string;
  public claims!:string;

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


  /*
  public home : boolean = true;
  public students : boolean = false;
  public users : boolean = false;
  */


  constructor(private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router){}


  selectedChoice = localStorage.getItem('selectedChoice');

  switchNav(choice: string) {
    localStorage.setItem('selectedChoice',choice);
      // Perform any other actions or updates based on the selected choice
      // ...
    }

  ngOnInit(): void {

    if(localStorage.getItem('selectedChoice') == null){
      localStorage.setItem('selectedChoice','choice1');
    }
    this.selectedChoice = localStorage.getItem('selectedChoice');
    console.log('choice :' + localStorage.getItem('selectedChoice'));

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
       // console.log("canUpdateUser",this.canUpdateUsers);
      //  console.log("canDeleteUser",this.canDeleteUsers);
        //console.log("canReadStudents",this.canReadStudents);
       // console.log("canUpdateStudents",this.canUpdateStudents);
       //console.log("canDeleteStudents",this.canDeleteStudents);
      }
    )

    this.userStore.getFullNameFromStore()
    .subscribe(
      val => {
        let fullNameFromToken = this.auth.getFullNameFromToken();
        this.fullName = val || fullNameFromToken;
        console.log("fullName",this.fullName);
      }
    );

      this.userStore.getRoleFromStore()
        .subscribe(val => {
          const roleFromToken = this.auth.getRoleFromToken();
          this.role = val || roleFromToken;
          console.log("role",this.role)
        });

  }

  logout(){
    this.auth.signOut();
  }

  /*
  changeEtatStudents(){
    this.home=false;
    this.students=true;
    this.users=false;
  }

  changeEtatHome(){
    this.home=true;
    this.students=false;
    this.users=false;
  }

  changeEtatUsers(){
    this.home=false;
    this.students=false;
    this.users=true;
  }
  */

}
