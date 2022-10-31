import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/authentication-service';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state);

  }

  constructor(private router: Router, private authservice: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authservice.isValidToken()) {
      // token valido abilito la route

      return true;
    } else {
      // token non valido o assente
      // se token scaduto chiamo il servizio di refresh
      if (sessionStorage.getItem('currentUser') && this.authservice.isExpiredToken()) {
        const currentUser = this.authservice.refreshToken();
        currentUser.toPromise().then(
          data => {
            // in caso il servizio non abbia restituito dati
            if (!data || !data.refreshToken) {
              this.authservice.logout();
              this.router.navigate(['login']);
              return false;
            }
            sessionStorage.removeItem('currentUser');
            sessionStorage.setItem('currentUser', JSON.stringify(data));
            this.router.navigate([state.url]);
            return true;
          },
          error => {
            // in caso di errore nel refresh del token effettuo il logout in modo da poter ritentare il login
            this.authservice.logout();
            this.router.navigate(['login']);
            return false;
          }
        );
      } else {
        this.poll(() => {
          // se ho ottenuto il token interrompo il polling
          if (sessionStorage.getItem('currentUser')) {
            return true;
          }

          // se non ho ancora l'appcode reindirizzo alla pagina di login e interrompo il polling
          if (!sessionStorage.getItem('appCode')) {
            return true;
          }
          const currentUser = this.authservice.richiediToken();
          currentUser.subscribe(
            data => {
              sessionStorage.setItem('currentUser', JSON.stringify(data));
              return true;
            },
            error => {
              this.authservice.logout();
              this.router.navigate(['login']);
              return false;
            }
          );
        }, 8000, 1000).then(() => {
          // Polling terminato correttamente
          if (!sessionStorage.getItem('appCode')) {
            // Polling terminato perchè non ho ancora l'appCode riporto utente a pagina di login
            this.router.navigate(['login']);
            return false;
          }
          // Polling terminato con token acquisito riporto utente su home con funzioni abilitate
          const userLogged = this.authservice.getUserLogged();

          if (userLogged) {
            this.router.navigate(['profilo']);
          }

          return true;
        }).catch(() => {
          // Polling time out riporto utente a pagina di login
          this.authservice.logout();
          this.router.navigate(['login']);
          return false;
        });
      }

    }

  }

  // The polling function
  poll(fn, timeout, interval) {
    const endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    const checkCondition = function (resolve, reject) {
      // If the condition is met, we're done!
      const result = fn();
      if (result) {
        resolve(result);
      } else if (Number(new Date()) < endTime) {
        setTimeout(checkCondition, interval, resolve, reject);
      } else {
        reject(new Error('timed out for ' + fn + ': ' + arguments));
      }
    };

    return new Promise(checkCondition);
  }

  parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }


}
