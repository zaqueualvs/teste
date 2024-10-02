import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../model/user";
import {Observable, tap} from "rxjs";
import {StatusEnum} from "../../model/status-enum";
import {AcademicDegreeEnum} from "../../model/academic-degree-enum";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL = '/api/users';

  constructor(private http: HttpClient) {
  }

  loggedUser: string | null = null;

  loadUserByLogin(email: string) {
    return this.http.get<User>(`${this.API_URL}/${email}`).pipe(
      tap((user: User) => {
        this.loggedUser = user.email;
      })
    );
  }

  updateUser(user: User) {
    console.log(user)
    return this.http.put(`${this.API_URL}/${user.email}`, user).pipe()
  }

  loadEnumsStatus(): Observable<StatusEnum[]> {
    console.log('111')
    return this.http.get<StatusEnum[]>(`${this.API_URL}/${this.loggedUser}/enums/status`);
  }

  loadEnumsAcademicDegree() {
    console.log('22')
    return this.http.get<AcademicDegreeEnum[]>(`${this.API_URL}/${this.loggedUser}/enums/academicDegree`).pipe(
      tap((value) => {
        console.log(value);
      })
    );
  }
}
