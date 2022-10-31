import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfigInterface} from '../model/appConfigInterface';


@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig: AppConfigInterface;

  constructor(private http: HttpClient) {
  }

  public loadAppConfig() {
    return this.http.get<AppConfigInterface>('./assets/runtime.json')
      .toPromise()
      .then((data: AppConfigInterface) => {
        this.appConfig = data;
      });
  }

  getConfig() {
    return this.appConfig;
  }

}
