import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'shell-app';
  constructor(private authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    // this.authenticationService.configure();
  }

  logoff() {
    this.authenticationService.logout();
  }
}
