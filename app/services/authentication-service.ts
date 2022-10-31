import {Injectable, Output, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppConfigService} from './app-config.service';
import {Profilo} from '../model/profilo';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  @Output() confermaProfilo = new EventEmitter<string>();

  private _urlLogoutArpa = this.appConfig.getConfig().logoutArpa;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
  }

  get urlLogoutArpa(): string {
    return this._urlLogoutArpa || '';
  }

  public registraApp() {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });

    const options = {
      headers: httpHeaders
    };

    return this.http.post<any>(this.appConfig.getConfig().baseUrlAuthService + '/registraApp',
      this.appConfig.getConfig().appSecret, options);
  }

  public richiediToken() {
    return this.http.post<any>(this.appConfig.getConfig().baseUrlAuthService + '/richiediToken',
      {
        appSecret: this.appConfig.getConfig().appSecret,
        appCode: sessionStorage.getItem('appCode')
      }
    );

  }

  public refreshToken() {
    return this.http.post<any>(this.appConfig.getConfig().baseUrlAuthService + '/refreshToken',
      {
        appCode: sessionStorage.getItem('appCode'),
        appSecret: this.appConfig.getConfig().appSecret,
        refreshToken: JSON.parse(sessionStorage.getItem('currentUser')).refreshToken
      }
    );
  }

  public refreshTokenTest() {
    return this.http.post<any>(this.appConfig.getConfig().baseUrlAuthService + '/refreshToken',
      {
        appCode: sessionStorage.getItem('appCode'),
        appSecret: this.appConfig.getConfig().appSecret,
        refreshToken: JSON.parse(sessionStorage.getItem('currentUser')).refreshToken
      }
    );
  }


  public logout() {
    // remove user from local storage to log user out
    const LOGOUT_ARPA: Window | null = this.logoutArpaWindow();

    setTimeout(() => {
      sessionStorage.clear();
      LOGOUT_ARPA.close();
    }, 500);

  }


  public parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  public getUserLogged() {
    if (sessionStorage.getItem('currentUser')) {
      return this.parseJwt(JSON.parse(sessionStorage.getItem('currentUser')).token);
    } else {
      return null;
    }
  }


  public isValidToken(): boolean {
    // token non esiste nella local storage quindi non valido
    if (!sessionStorage.getItem('currentUser')) {
      return false;
    }
    // token esiste ma devo verificare che non sia scaduto
    if (this.isExpiredToken()) {
      return false;
    }

    // token valido
    return true;
  }

  public isExpiredToken(): boolean {
    const tokenDecoded = this.parseJwt(JSON.parse(sessionStorage.getItem('currentUser')).token);
    const dataScadenza: Date = new Date(tokenDecoded.exp * 1000);
    const now: Date = new Date();
      return now > dataScadenza;
  }


  public getCodUnorgs(cf: string) {
    const params = new HttpParams().set('codiceFiscale', cf);
    return this.http.get<Array<Profilo>>(this.appConfig.getConfig().baseUrlService + this.appConfig.getConfig().jwtContextPath + '/campionamento/codunorgs', {params});
  }

  public codUnorg() {
    return sessionStorage.getItem('codUnorg');
  }


  /*public getProfiloUtente() {
    const params = new HttpParams();
    const headers = new HttpHeaders();
    headers.append('X_rtsysid_app', this.appConfig.getConfig().X_rtsysid_app);
    return this.http.get<any>(this.appConfig.getConfig().baseUrlProfili, {headers, params});
  }*/

  public logoutArpaWindow(): Window | null {
    const w = 600;
    const h = 600;

    const dualScreenLeft: number = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop: number = window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width: number = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width;
    const height: number = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height;

    const systemZoom: number = width / window.screen.availWidth;
    const left: number = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top: number = (height - h) / 2 / systemZoom + dualScreenTop;

    const LOGOUT_ARPA: Window | null = window.open(
      this.urlLogoutArpa,
      'Popup',
      `rel="noopener", toolbar=yes, scrollbars=yes, resizable=yes, width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left}`);

    if (LOGOUT_ARPA != null && window.focus) {
      LOGOUT_ARPA.focus();
    }

    return LOGOUT_ARPA;
  }


}


