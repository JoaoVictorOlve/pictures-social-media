import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {

  constructor(private authService:AuthService, private cookieService: CookieService){}

  ngOnInit(){
    console.log(this.isLoggedIn())
  }

  logout():void{
    this.cookieService.delete( 'authorization' , '/' );
    this.authService.logout();
    location.reload();
  }

  isLoggedIn() {
    return this.authService.isAuthenticated;
  }
}
