import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../shared/models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserToken } from '../shared/models/user-token';
import { UserId } from '../shared/models/user-id';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public tokenSubject: BehaviorSubject<UserToken | null>;
  public token: Observable<UserToken | null>;

  private readonly apiUrl = "http://localhost:3000/api/user"

  constructor(private http: HttpClient) {
  }

  registerUser(user:User): Observable<User>{
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  loginUser(user:User): Observable<User>{
    return this.http.post<User>(`${this.apiUrl}/login`, user, {
      withCredentials: true
    });
  }

  getUserId(): Observable<UserId>{
    return this.http.get<UserId>(`${this.apiUrl}/getId`, {
      withCredentials:true
    })
  }
}
