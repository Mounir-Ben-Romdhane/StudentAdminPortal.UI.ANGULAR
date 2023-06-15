import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './students/students.component';
import { ViewStudentComponent } from './students/view-student/view-student.component';
import { LoginComponent } from './layout/login/login.component';
import { SignupComponent } from './layout/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { UserComponent } from './users/user/user.component';
import { DashboardComponent } from './layout/dashboard/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component : LoginComponent
  },
  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Students',
    component: StudentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Students/:id',
    component: ViewStudentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component : LoginComponent
  },
  {
    path: 'signup',
    component : SignupComponent
  },
  {
    path: 'Users',
    component : UserComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
