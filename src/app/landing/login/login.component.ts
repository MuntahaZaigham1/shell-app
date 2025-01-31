import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from '../../core/services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage = '';
  loading = false;
  submitted = false;
  returnUrl: string = 'dashboard';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authenticationService: AuthenticationService
  ) { }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '';
      sessionStorage.setItem('redirectUrl', this.returnUrl);
    });
  }


  onSubmit() {
    this.authenticationService.login(null);
    return;
  }
  onBack(): void {
    this.router.navigate(['/']);
  }


}
