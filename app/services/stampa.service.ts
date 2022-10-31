import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from './app-config.service';
import {Observable} from 'rxjs';
import {CampElencoCodaRequest} from '../model/request/campElencoCodaRequest';
import {CampElencoCodaResponse} from '../model/campElencoResponse';
import {default as fileDownlad} from 'js-file-download';


@Injectable({
  providedIn: 'root'
})
export class StampaService {

  private baseUrl = this.appConfig.getConfig().baseUrlService + this.appConfig.getConfig().jwtContextPath + '/campionamento';

  constructor(private client: HttpClient, private appConfig: AppConfigService) { }


  inserisciInCoda(request: CampElencoCodaRequest): Observable<CampElencoCodaResponse> {
    return this.client.post<CampElencoCodaResponse>(`${this.baseUrl}/coda/inserisci`, request);
  }

  controlloStato(idCoda): Observable<CampElencoCodaResponse> {
    return this.client.get<CampElencoCodaResponse>(`${this.baseUrl}/coda/${idCoda}/checkstato`);
  }

  recuperaFile(idCoda): Observable<string> {
    const requestOptions: Object = {
      responseType: 'text'
    };

    return this.client.get<string>(`${this.baseUrl}/file/recupera/${idCoda}`, requestOptions);
  }

  downloadFile(dataStream: string, nameFile: string): void {
    let base64, mimeType;

    if (dataStream.split(',').length > 1) {
      base64 = dataStream.split(',')[1];
      mimeType = dataStream.split(',')[0].split(':')[1].slice(0, -7);
    } else {
      base64 = dataStream;
    }

    const byteCharacters = atob(base64);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: mimeType});

    fileDownlad(blob, nameFile, mimeType);

  }

}
