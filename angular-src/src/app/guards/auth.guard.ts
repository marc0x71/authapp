import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate() {
    if (this.authService.loggedIn()) {
      console.log("Page authorized!")
      return true;
    } else {
      console.log("Page not authorized!")
      this.router.navigate(['/login']);
      return false;
    }
  }
}
