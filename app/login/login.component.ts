import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../services/authentication-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authservice: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    sessionStorage.clear();
    // se non sono loggato registro l'app e recupero appCode e authCode
    const respAuth = this.authservice.registraApp();

     respAuth.subscribe(

       data => {
        sessionStorage.setItem('appCode', data.appCode);
        sessionStorage.setItem('authCode', data.authCode);
        sessionStorage.setItem('authenticationUrl', data.authenticationUrl);
        const currentUrl = document.location.href.endsWith('/') ? document.location.href : document.location.href + '/';
        window.location.href = data.authenticationUrl + '/' + data.appCode + '/' + data.authCode
          + '?url=' + currentUrl + 'authResponseHandler';
      },
      () => {
        return false;
      }
    );
  }


}
