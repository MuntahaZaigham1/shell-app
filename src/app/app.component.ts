import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'shell-app';
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    // this.authenticationService.configure();
    this.router.events.subscribe(event => {
      if (event ) {
        console.log('Navigation:', event);
      }
    });
  }

  logoff() {
    this.authenticationService.logout();
  }
}
