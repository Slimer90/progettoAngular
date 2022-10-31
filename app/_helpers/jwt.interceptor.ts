import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppConfigService} from '../services/app-config.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private appConfig: AppConfigService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = request.headers;

    // add authorization header with jwt token if available
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      headers = headers.append('Authorization', `Bearer ${currentUser.token}`);
    }

    if (this.appConfig.getConfig()) {

      headers = headers.append('X_rtsysid_app', this.appConfig.getConfig().X_rtsysid_app);
    }

    const cloneReq = request.clone({headers});

    return next.handle(cloneReq);
    // return next.handle(request);
  }
}
