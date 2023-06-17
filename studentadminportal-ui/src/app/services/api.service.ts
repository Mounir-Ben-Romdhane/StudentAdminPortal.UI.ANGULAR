import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Roles } from '../models/api-models/roles.model';
import { User } from '../models/api-models/user.model';
import { addUserRequest } from '../models/api-models/add-user-re.model';
import { UpdateStudentRequest } from '../models/api-models/update-student-request.model';
import { UpdateUserRequest } from '../models/api-models/update-user-req.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient ) { }

  getUsers() : Observable<User[]>{
    return this.http.get<User[]>(this.baseApiUrl+ '/Users');
  }

  getClaims(roleId: string) : Observable<any>{
    return this.http.get<any>(this.baseApiUrl+'/Claims');
  }

  getRolesList(): Observable<Roles[]>{
    return this.http.get<Roles[]>(this.baseApiUrl + '/Roles');
  }

  getUser(userId : string) : Observable<User> {
    return this.http.get<User>(this.baseApiUrl + '/Users/' + userId);
  }

  updateUser(userId: string, userRequest: User) : Observable<User>{
    const updateUserRequest: UpdateUserRequest = {
      id: userId,
      firstName: userRequest.firstName,
      lastName: userRequest.lastName,
      userName: userRequest.userName,
      email: userRequest.email,
      roleId: userRequest.roleId
    }

    return this.http.put<User>(this.baseApiUrl + '/Users/' + userId , updateUserRequest);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(this.baseApiUrl + '/Users/' + userId);
  }

  addUser(userRequest: User): Observable<User>{
    const addUserRequest: addUserRequest = {
      firstName: userRequest.firstName,
      lastName: userRequest.lastName,
      userName: userRequest.userName,
      email: userRequest.email,
      password: userRequest.password,
      roleId: userRequest.roleId
    }
    return this.http.post<User>(this.baseApiUrl + '/Users/Add',addUserRequest);
  }
}
