import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-end';

  constructor(private authService: AuthService, private cookieService: CookieService) {
    const token = this.cookieService.get("authorization");
    if (token) {
      this.authService.login(); // Set authentication state
    } else {
      this.authService.logout();
    }
  }
}
