import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/api-models/student.model';
import { UpdateStudentRequest } from '../models/api-models/update-student-request.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseApiUrl = 'https://localhost:44308';

  constructor(private httpClient: HttpClient) { }

  getStudents() : Observable<Student[]>{
    return this.httpClient.get<Student[]>(this.baseApiUrl + '/Students');
  }

  getStudent(studentId: string): Observable<Student> {
    return this.httpClient.get<Student>(this.baseApiUrl + '/Students/' + studentId);
  }

  updateStudent(studentId: string, studentRequest: Student) : Observable<Student>{
    const updateStudentRequest: UpdateStudentRequest = {
      firstName: studentRequest.firstName,
      lastName: studentRequest.lastName,
      dateofBirth: studentRequest.dateofBirth,
      email: studentRequest.email,
      mobile: studentRequest.mobile,
      genderId: studentRequest.genderId,
      physicalAddress: studentRequest.address.physicalAddress,
      postalAddress: studentRequest.address.postalAddress
    }

    return this.httpClient.put<Student>(this.baseApiUrl + '/Students/' + studentId , updateStudentRequest);
  }

}
