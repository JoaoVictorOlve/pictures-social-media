import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = false;

  constructor(private cookieService:CookieService) {
    const tokenJson = this.cookieService.get('authorization');
  }

  login(){
    this.isAuthenticated = true;
  }

  logout(){
    this.isAuthenticated = false;
  }

  isAuthenticatedUser() {
    return this.isAuthenticated;
  }
}
