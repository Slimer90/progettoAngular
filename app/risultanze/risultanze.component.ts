import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {CampionamentoService} from '../services/services';
import {Campione} from '../model/campione';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {Costanti} from '../util/costanti';
import {AuthenticationService} from '../services/authentication-service';
import {NoteVerbaleComponent} from '../note-verbale/note-verbale.component';
import {RequestVerbale} from '../model/request/requestVerbale';
import {DynamicComponentData} from '../model/class/dynamic-component';
import {ModalConfig} from '../components/generic-message/generic-message.component';
import {TimerComponent} from '../components/timer/timer.component';
import {DynamicHelperService} from '../services/dynamic-helper.service';
import {TipoElencoEnum} from '../model/enums/tipoElencoEnum';
import {StampaService} from '../services/stampa.service';
import {CampElencoCodaResponse, StatoCodaEnum} from '../model/campElencoResponse';
import {DataDownloadFile} from '../model/dataDownloadFile';
import {CampElencoCodaRequest} from '../model/request/campElencoCodaRequest';


@Component({
  selector: 'app-risultanze',
  templateUrl: './risultanze.component.html',
  styleUrls: ['./risultanze.component.css']
})
export class RisultanzeComponent implements OnInit {

  campioneDaChiudere;
  modalRefNoteVerbale: NgbModalRef;
  modalRefConfirmDialog: NgbModalRef;
  listCampioni = new Array<Campione>();
  typeError: string;
  message: string;
  contesto = 'RISULTANZE';
  notaVerbale: string;

  tipoElencoEnum = TipoElencoEnum;


  constructor(private spinner: NgxSpinnerService,
              private service: CampionamentoService,
              private stampaService: StampaService,
              private dynamicHelperService: DynamicHelperService,
              private modal: NgbModal,
              private authservice: AuthenticationService) {
  }

  ngOnInit() {
    this.service.produciVerbaleEmitter.subscribe(
      () => {
        this.produciVerbale();
      }
    );

    this.service.noteVerbale.subscribe(
      (nota: string) => {
        this.notaVerbale = nota;
        this.modalRefConfirmDialog = this.modal.open(ConfirmDialogComponent, {backdrop: 'static', keyboard: false, size: 'lg'});
        this.modalRefConfirmDialog.componentInstance.modalRef = this.modalRefConfirmDialog;
        this.modalRefConfirmDialog.componentInstance.contesto = 'VERBALE';
        this.modalRefConfirmDialog.componentInstance.message = 'Confermi la chiusura del verbale e la chiusura del campione?';
      }
    );
  }


  getListaCampioni(list: Campione[]) {
    this.listCampioni = list;
    if (!this.listCampioni || this.listCampioni.length === 0) {
      this.typeError = 'warning';
      this.message = ' Nessun elemento trovato!';
    } else {
      this.typeError = null;
      this.message = null;
    }
  }

  richiediNoteStampaVerbale(campione: Campione) {
    if ('AP' === campione.stato) {
      this.campioneDaChiudere = campione;
      this.modalRefNoteVerbale = this.modal.open(NoteVerbaleComponent, {backdrop: 'static', keyboard: false, size: 'lg'});
      this.modalRefNoteVerbale.componentInstance.modalRef = this.modalRefNoteVerbale;
    } else {
      this.produciVerbale(campione);
    }

  }


  produciVerbale(campione?: Campione) {
    this.spinner.show();
    this.message = '';
    const userLogged = this.authservice.getUserLogged();
    const requestVerbale = new RequestVerbale();

    requestVerbale._idCampione = campione != null ? campione.id : this.campioneDaChiudere.id;
    requestVerbale._user = userLogged ? userLogged.USER_NAME + ' ' + userLogged.USER_SURNAME : '';
    requestVerbale._notaVerbale = this.notaVerbale ? this.notaVerbale : null;

    this.service.produciVerbale(requestVerbale)
      .subscribe(
        (data: string) => {
          const dlnk = document.getElementById('produciVerbale') as HTMLLinkElement;
          dlnk.href = 'data:application/octet-stream;base64,' + data;
          dlnk.click();
          this.spinner.hide();
        },
        (error) => {
          if (typeof error.error === 'string') {
            this.message = error.error;
          } else {
            this.message = error.statusText;
          }

          this.typeError = 'danger';
          this.spinner.hide();
        }
      );
  }

  produciElenco(idElenco: number, tipoElenco: TipoElencoEnum, nameFile: string) {

    if (idElenco == null) {

      this.typeError = 'danger';
      this.message = 'Dati per la richiesta errati!';

    } else {

      const request = {
        tipoElenco,
        idElenco
      } as CampElencoCodaRequest;

      this.spinner.show();

      this.stampaService.inserisciInCoda(request)
        .subscribe(
          (response: CampElencoCodaResponse) => {
            this.spinner.hide();

            const data = {} as DynamicComponentData<CampElencoCodaResponse & DataDownloadFile>;
            const style = {
              closeable: false
            } as ModalConfig;

            style.modal = {
              maxWidth: '50%'
            };
            style.modalHeader = {
              title: 'Richiesta stampa elenco ' + tipoElenco
            };

            data.data = {...response, name: nameFile};
            this.dynamicHelperService.selectComponent(TimerComponent, data, style);

          },
          () => {
            this.spinner.hide();
            alert('error');
          }
        );
    }

  }


  decodificaTipoUniverso(code) {
    return Costanti.decodificaTipoUniverso(code);
  }

  decodificaStato(code) {
    return Costanti.decodificaStato(code);
  }

  public isProfiloAdg() {
    const codunorgs = this.authservice.codUnorg();
    return codunorgs === 'AdG';

  }

}
