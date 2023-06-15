import { Component, OnInit } from '@angular/core';
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


  public home : boolean = true;
  public students : boolean = false;
  public users : boolean = false;

  constructor(private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router){}


  ngOnInit(): void {

    this.userStore.getClaimsFromStore().
    subscribe(
      val => {
        let claimsFromToken = this.auth.getClaimsFromToken();
        this.myClaimsList = val || claimsFromToken;
        console.log("listClaims",this.myClaimsList);
        const desiredClaim = 'DeleteStudentss';
        const hasClaim = this.myClaimsList.includes(desiredClaim);
        console.log("TestIfContains",hasClaim);
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


}
