import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {CampionamentoService} from './services/services';
import {AuthenticationService} from './services/authentication-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  profilo = sessionStorage.getItem('codUnorg') != null ? 'PROFILO: ' + sessionStorage.getItem('codUnorgDescr') + ' (' + sessionStorage.getItem('codUnorg') + ')' : '';
  utente;
  nomeUtente: string;
  message: string;

  constructor(private router: Router, private service: CampionamentoService, private route: ActivatedRoute, private authservice: AuthenticationService) {

    this.authservice.confermaProfilo.subscribe(
      () => {
        this.profilo = sessionStorage.getItem('codUnorg') != null ? 'PROFILO: ' + sessionStorage.getItem('codUnorgDescr') + ' (' + sessionStorage.getItem('codUnorg') + ')' : '';
      }
    );

  }

  logout() {
    const LOGOUT_ARPA: Window | null = this.authservice.logoutArpaWindow();

    setTimeout(() => {
      sessionStorage.clear();
      this.utente = undefined;
      LOGOUT_ARPA.close();
      this.router.navigate(['login']);
    }, 500);

  }

  isUserLogged() {
    const userLogged = this.authservice.getUserLogged();
    if (userLogged) {
      this.nomeUtente = userLogged.USER_NAME + ' ' + userLogged.USER_SURNAME;
      return true;
    } else {
      return false;
    }
  }

  isUserAuthorized() {
    const codunorgs = this.authservice.codUnorg();
    return codunorgs != null && codunorgs.length > 0;
  }

  isProfiloAdg() {
    const codunorgs = this.authservice.codUnorg();
    return codunorgs === 'AdG';
  }

  getProfiloCorrente() {
    return sessionStorage.getItem('codUnorg') != null ? 'PROFILO: ' + sessionStorage.getItem('codUnorgDescr') + ' (' + sessionStorage.getItem('codUnorg') + ')' : '';
  }
}
