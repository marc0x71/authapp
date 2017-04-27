import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  email: String;
  username: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) {
      // constructor
    }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      username: this.username,
      password: this.password,
      email: this.email
    };

    // required fields
    if (!this.validateService.validateRegister(user)) {
      this.flashMessage.show("Plese fill in all fields", { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }
    // valida email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show("Plese use a valid email", { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    // register
    this.authService.registerUser(user).subscribe(data => {
      if (data.success) {
        this.flashMessage.show("You are now registered and can log in", { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show("Something went wrong", { cssClass: 'alert-danger', timeout: 3000 });
        this.router.navigate(['/register']);
      }
    });
    this.flashMessage.show("ok!", { cssClass: 'alert-info', timeout: 3000 });
  }

}
