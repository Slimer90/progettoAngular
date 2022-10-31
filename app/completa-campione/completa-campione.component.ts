import {Component, OnInit} from '@angular/core';
import {CampionamentoService} from '../services/services';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {DatePipe} from '@angular/common';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModalRef, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {Costanti} from '../util/costanti';
import {RigaUniverso} from '../model/riga-universo';
import {AuthenticationService} from '../services/authentication-service';
import { TrimestrAnno } from '../model/trimestreAnno';

@Component({
  selector: 'app-completa-campione',
  templateUrl: './completa-campione.component.html',
  styleUrls: ['./completa-campione.component.css']
})
export class CompletaCampioneComponent implements OnInit {

  contesto;
  listRigheSelezionate = new Array<any>();
  dataInizio;
  dataFine;
  listCampioni;
  idCampioneSelezionato;
  idCampioneDaCompletare;
  righeCompletaCampione;
  campioneSelezionato;
  typeError;
  message;
  error = new Subject();
  modalRef: NgbModalRef;
  tipologiaUniverso;
  pivaRicerca;
  denomEnteRicerca;
  progettoRicerca;
  trimestre;
  elencoTrimestri;



  constructor(private service: CampionamentoService, private route: ActivatedRoute, private datePipe: DatePipe,
              private spinner: NgxSpinnerService, private modal: NgbModal, private authservice: AuthenticationService) {
    this.route.paramMap.subscribe(
      (p) => {
        this.contesto = p.get('contesto');
        this.dataFine = '';
        this.dataInizio = '';
        this.listCampioni = [];
        this.idCampioneSelezionato = 0;
        this.righeCompletaCampione = [];

      }
    );

    this.service.aggiungiAlCampioneEmitter.subscribe(
      () => {
        this.aggiungiAlCampione();
      }
    );
  }

  elencoAnni : TrimestrAnno[];

  ngOnInit() {
    this.getTrimestri();

    this.service.elencoAnni().subscribe(
      (data) => {
        this.elencoAnni = data;
        this.spinner.hide();
      },
      (error) => {
        console.error('[CLASSIFICA-RIGHE.COMPONENT] recupera trimestri error :: ', error);
        this.spinner.hide();
      }
    );
  }

  getTipologieUniverso() {
    const codunorgs = this.authservice.codUnorg();
    return Costanti.getTipologieUniverso();
  }

  getTrimestri() {
    if (this.elencoTrimestri && this.elencoTrimestri.length > 0) {
      return this.elencoTrimestri;
    } else {
      this.service.elencoTrimestri().subscribe(
        (data) => {
          this.elencoTrimestri = data;
        },
        (err) => {
          this.typeError = 'danger';
          this.message = err.error;
        }
      );
    }
  }


  cercaCampione(corrente: boolean) {

    this.spinner.show();

    this.message = '';

    const stato = this.contesto === 'corrente' ? 'AP' : 'CH';

    this.service.ricercaCampione(this.trimestre, this.tipologiaUniverso, stato, false).subscribe(
      (data: Array<any>) => {
        this.listCampioni = [];
        if (corrente) {
          this.listCampioni = data;
        } else {
          for (const x of data) {
            if (x.id !== this.idCampioneDaCompletare) {
              this.listCampioni.push(x);
            }
          }
        }
        if (this.listCampioni.length === 0) {
          this.typeError = 'warning';
          this.message = 'Nessun campione trovato';
          this.error.next();

        }
        this.spinner.hide();
      }
    );

  }

  confermaCompletaCampione(estrai: boolean) {

    this.spinner.show();
    this.message = '';

    if (!this.idCampioneSelezionato || this.idCampioneSelezionato === 0) {
      this.typeError = 'danger';
      this.message = ' Selezionare un campione';
      this.error.next();
      this.spinner.hide();
      return;
    }

    this.message = '';

    // aggiustare


    this.listRigheSelezionate = new Array<any>();

    this.service.confermaCompletaCampione(this.idCampioneSelezionato, this.contesto === 'corrente', this.pivaRicerca, this.denomEnteRicerca, this.progettoRicerca).subscribe(
      (data: Array<any>) => {

        this.righeCompletaCampione = data;
        if (!this.righeCompletaCampione || this.righeCompletaCampione.length === 0) {
          this.typeError = 'warning';
          this.message = 'Nessun dato trovato';
          this.error.next();
          this.spinner.hide();
          return;
        }
        this.spinner.hide();
      }
    );
    /*  }else{
          for(let x of this.listCampioni){
            if(x.id===this.idCampioneSelezionato){
              this.campioneSelezionato=x;
              this.idCampioneDaCompletare=x.id;
              this.campioneSelezionato.dataDal = this.datePipe.transform(x.dataDal,'yyyy-MM-dd');
              this.campioneSelezionato.dataAl = this.datePipe.transform(x.dataAl,'yyyy-MM-dd')
              break;
            }
          }
          this.dataFine='';
          this.dataInizio='';
          this.listCampioni=new Array()
          this.idCampioneSelezionato=0;
          this.spinner.hide();
      }*/


  }

  aggiungiRigheSelezionate() {
    this.spinner.show();

    const userLogged = this.authservice.getUserLogged();
    if (!userLogged || !userLogged.USER_CF) {
      this.message = ' Si è verificato un errore. Nessun utente loggato';
      this.typeError = 'danger';
      this.error.next();
      this.spinner.hide();
      return;

    }

    this.service.aggiungiRigaCampionamento(this.listRigheSelezionate, this.idCampioneSelezionato, userLogged.USER_CF).subscribe(
      (data) => {
        this.confermaCompletaCampione(true);
        this.spinner.hide();
      }, (error) => {
        this.message = 'Si è verificato un errore';
        this.typeError = 'danger';
        this.error.next();
        this.spinner.hide();
      }
    );
  }


  aggiungiAlCampione() {
    // this.listRigheSelezionate.push(id);
    this.aggiungiRigheSelezionate();
  }

  confirmAggiungiAlCampione() {

    this.listRigheSelezionate = new Array<RigaUniverso>();

    for (const x of this.righeCompletaCampione) {
      if (x.selected) {
        this.listRigheSelezionate.push(x.id);
      }
    }

    if (this.listRigheSelezionate.length === 0) {
      this.message = 'Nessuna riga selezionata';
      this.typeError = 'warning';
      this.error.next();
      return;
    }

    this.modalRef = this.modal.open(ConfirmDialogComponent, {backdrop: 'static', keyboard: false, size: 'lg'});
    this.modalRef.componentInstance.modalRef = this.modalRef;
    this.modalRef.componentInstance.contesto = 'COMPLETACAMPIONE';
    this.modalRef.componentInstance.message = 'Vuoi aggiungere le righe selezionate al campione?';
  }


  decodificaTipoUniverso(codice) {
    return Costanti.decodificaTipoUniverso(codice);
  }

}
