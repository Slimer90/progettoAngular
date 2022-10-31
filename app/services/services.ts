import {throwError as observableThrowError, Observable} from 'rxjs';
import {Injectable, Output, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Parametro} from '../model/parametro';
import {DatePipe} from '@angular/common';
import {Utente} from '../model/utente';
import {AppConfigService} from './app-config.service';
import {Campione} from '../model/campione';
import {AuthenticationService} from './authentication-service';
import {Universo} from '../model/universo';
import {RigaUniverso} from '../model/riga-universo';
import {Trimestre} from '../model/trimestre';
import {CriterioCampionamento} from '../model/criterioCampionamento';
import {map} from 'rxjs/operators';
import {RequestVerbale} from '../model/request/requestVerbale';
import { TrimestrAnno } from '../model/trimestreAnno';


@Injectable()
export class CampionamentoService {


  constructor(private client: HttpClient,
              private datePipe: DatePipe,
              private appConfig: AppConfigService,
              private authservice: AuthenticationService) {
  }

  @Output() eliminaParametroEmitter = new EventEmitter();
  @Output() aggiungiAlCampioneEmitter = new EventEmitter();
  @Output() aaggiornaCampioneEmitter = new EventEmitter();
  @Output() emitUtente = new EventEmitter<Utente>();
  @Output() produciVerbaleEmitter = new EventEmitter<Utente>();
  @Output() noteVerbale = new EventEmitter<string>();
  @Output() eliminaCampioneEmitter = new EventEmitter<number>();

  private baseUrl = this.appConfig.getConfig().baseUrlService + this.appConfig.getConfig().jwtContextPath + '/campionamento';

  elencoParametri(dataInizio: string, dataFine: string, attivi: boolean, tipo): Observable<Parametro[]> {
    const url = this.baseUrl + '/elencoParametri';

    const dataInizioParam = (dataInizio == null || dataInizio === '') ? '' : this.datePipe.transform(dataInizio, 'dd/MM/yyyy');
    const dataFineParam = (dataFine == null || dataFine === '') ? '' : this.datePipe.transform(dataFine, 'dd/MM/yyyy');

    const params = new HttpParams()
      .set('dataInizio', dataInizioParam)
      .set('dataFine', dataFineParam)
      .set('attivo', attivi == null ? 'false' : attivi + '')
      .set('tipo', tipo ? tipo : '');

    return this.client.get<Parametro[]>(url, {params});
  }

  salvaParametro(parametro: Parametro) {

    const url = this.baseUrl + '/salvaParametro';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    try {
      return this.client.post<Response>(url, parametro, {headers});
    } catch (error) {
      const details = error.json();
      return observableThrowError(new Error(details));
    }

  }


  eliminaParametro(x: Parametro) {
    const url = this.baseUrl + '/eliminaParametro';
    const params = new HttpParams().set('id', x.id + '');
    return this.client.delete(url, {params});

  }

  estraiUniverso(tipoEstrazione, idTrimestre, user, codunorgs) {
    const url = this.baseUrl + '/estraiUniverso';
    const params = new HttpParams().set('tipo', tipoEstrazione).set('trimestre', idTrimestre).set('user', user).set('codUnorg', codunorgs);
    return this.client.get<Universo>(url, {params});
  }

  ricercaUniverso(trimestre: number, tipo: string): Observable<Universo[]> {

    const url = this.baseUrl + '/listUniverso';
    const codunorg = this.authservice.codUnorg();

    const params = new HttpParams()
      .set('trimestre', trimestre ? trimestre.toString() : '')
      .set('tipo', tipo ? tipo : '')
      .set('codUnorg', codunorg ? codunorg : '');

    return this.client.get<Universo[]>(url, {params});
  }


  ricercaCampione(trimestre, tipoUniverso, stato, soloEstratti): Observable<Campione[]> {
    const url = this.baseUrl + '/listCampione';
    const codunorg = this.authservice.codUnorg();

    let params = new HttpParams()
      .set('trimestre', trimestre ? trimestre : '')
      .set('tipoUniverso', tipoUniverso ? tipoUniverso : '')
      .set('stato', stato ? stato : '')
      .set('soloEstratti', soloEstratti);

    if (codunorg && codunorg !== 'AdG') {
      params = params.set('codUnorg', codunorg ? codunorg : '');
    }

    return this.client.get<Campione[]>(url, {params});
  }

  confermaCompletaCampione(idCampione, corrente: boolean, piva, denominazione, progetto) {
    let url = this.baseUrl + '/completaCampione/';
    if (corrente) {
      url = url + 'corrente/';
    } else {
      url = url + 'pregresso/';
    }
    url = url + '/getRighe';
    const params = new HttpParams().set('idCampione', idCampione + '').set('piva', piva ? piva : '').set('denominazione', denominazione ? denominazione : '').set('progetto', progetto ? progetto : '');
    /*if(!corrente){
        params.set('idCampionePregresso', idCampionePergresso+'')  ;
    }*/
    return this.client.get(url, {params});
  }

  aggiungiRigaCampionamento(idsRiga, idCampione, user) {
    const url = this.baseUrl + '/completaCampione/';
    const params = new HttpParams().set('idCampione', idCampione + '').set('user', user);

    return this.client.post(url, idsRiga, {params});
  }


  estraiRigheCampione(idCampione) {
    const url = this.baseUrl + '/estraiRigheCampione';

    const userLogged = this.authservice.getUserLogged();

    const params = new HttpParams().set('idCampione', idCampione + '').set('utente', userLogged.USER_CF);

    return this.client.get(url, {params});

  }


  ricercaRigheUniverso(idUniverso) {
    const url = this.baseUrl + '/listRigheUniverso';
    const params = new HttpParams().set('idUniverso', idUniverso + '');

    return this.client.get(url, {params});
  }

  salvaRigaUniverso(rigaUniverso: RigaUniverso): Observable<any> {
    const url = this.baseUrl + '/salvaRigaUniverso';
    return this.client.post<any>(url, rigaUniverso);
  }

  salvaCriteriCampione(idUniverso, idCampione, listParametri): Observable<number> {
    const url = this.baseUrl + '/salvaCriteri';
    const params = new HttpParams()
      .set('idUniverso', idUniverso + '')
      .set('idCampione', idCampione + '');

    return this.client.post<number>(url, listParametri, {params});

  }

  listRigheCampione(idCampione) {
    const url = this.baseUrl + '/listRigheCampione';
    const params = new HttpParams().set('idCampione', idCampione + '');
    return this.client.get(url, {params});
  }

  listCriteriCampionamento(idCampione): Observable<CriterioCampionamento[]> {
    const url = this.baseUrl + '/listCriteriCampionamento';
    const params = new HttpParams().set('idCampione', idCampione + '');
    return this.client.get<CriterioCampionamento[]>(url, {params});
  }


  salvaCampione(x) {
    const url = this.baseUrl + '/salvaCampione';
    return this.client.post(url, x);
  }

  salvaRigaCampione(x) {
    const url = this.baseUrl + '/salvaRigaCampione';
    return this.client.post(url, x);
  }

  ricercaBando(dataInizio, dataFine) {
    const url = this.baseUrl + '/listBando';
    const params = new HttpParams().set('dataDal', dataInizio ? this.datePipe.transform(dataInizio, 'dd/MM/yyyy') : '')
      .set('dataAl', dataFine ? this.datePipe.transform(dataFine, 'dd/MM/yyyy') : '');
    return this.client.get(url, {params});
  }

  produciVerbale(request: RequestVerbale): Observable<string> {
    const url = this.baseUrl + '/produciVerbale';

    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });

    return this.client.post<{status: number, message: string}>(url, request, {headers})
      .pipe(
        map(({message}) => message)
      );
  }


  /*produciElencoCampione(idCampione, ente): Observable<string> {
    const url = this.baseUrl + '/produciElenco';
    const params = new HttpParams()
      .set('idCampione', idCampione)
      .set('ente', ente ? ente : '');

    return this.client.get<string>(url, {params});
  }*/

  /*produciElencoUniverso(idUniverso): Observable<{status: number, message: string}> {
    const url = this.baseUrl + '/produciElencoUniverso';
    const params = new HttpParams().set('idUniverso', idUniverso);
    return this.client.get<{status: number, message: string}>(url, {params});
  }*/

  elencoTrimestri(): Observable<Trimestre[]> {
    const url = this.baseUrl + '/listTrimestri';
    return this.client.get<Trimestre[]>(url);
  }

  elencoAnni(): Observable<TrimestrAnno[]> {
    const url = this.baseUrl + '/listAnni';
    return this.client.get<TrimestrAnno[]>(url);
  }

  eliminaCampione(id) {
    const url = this.baseUrl + '/eliminaCampione';
    const params = new HttpParams().set('id', id + '');
    return this.client.delete(url, {params});

  }

  dettaglioCampione(idCampione): Observable<Campione> {
    const url = this.baseUrl + '/getCampione';
    const params = new HttpParams().set('idCampione', idCampione + '');

    return this.client.get<Campione>(url, {params});
  }


}
