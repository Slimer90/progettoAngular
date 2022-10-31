import {Component, OnInit} from '@angular/core';
import {CampionamentoService} from '../services/services';
import {Parametro} from '../model/parametro';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {Subject} from 'rxjs';
import {NgbModalRef, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {NgForm} from '@angular/forms';
import {Costanti} from '../util/costanti';
import {AuthenticationService} from '../services/authentication-service';


@Component({
  selector: 'app-parametri',
  templateUrl: './parametri.component.html',
  styleUrls: ['./parametri.component.css']
})
export class ParametriComponent implements OnInit {

  jobState;
  tipologiaUniverso;
  dataInizioRicerca: string;
  dataFineRicerca: string;
  soloAttivi: boolean;
  elencoParametri = new Array<Parametro>();
  titoloDettaglio = '';
  parametroSelezionato: Parametro;
  message: string;
  typeError: string;
  error = new Subject<string>();
  modalRef: NgbModalRef;


  constructor(private service: CampionamentoService, private router: Router, private datePipe: DatePipe, private modal: NgbModal, private authservice: AuthenticationService) {
    this.service.eliminaParametroEmitter.subscribe(
      () => this.elimina(this.parametroSelezionato)
    );
  }

  ngOnInit() {
    this.jobState = 'ELENCO';

  }


  elenco() {
    this.message = '';
    this.service.elencoParametri(this.dataInizioRicerca, this.dataFineRicerca, this.soloAttivi, this.tipologiaUniverso).subscribe(
      (data) => {
        if (data == null || data.length === 0) {
          this.elencoParametri = [];
          this.typeError = 'warning';
          this.message = '  Nessun dato trovato';
          this.error.next();
          return;
        }
        this.elencoParametri = data;
      }
    );

  }

  modifica(x: Parametro) {
    this.parametroSelezionato = x;
    this.parametroSelezionato.dataInizio = this.datePipe.transform(x.dataInizio, 'yyyy-MM-dd');
    this.parametroSelezionato.dataFine = this.datePipe.transform(x.dataFine, 'yyyy-MM-dd');
    this.jobState = 'DETTAGLIO';
    this.titoloDettaglio = 'MODIFICA PARAMETRO';
  }

  elimina(x: Parametro) {
    if (x != null) {
      this.service.eliminaParametro(x).subscribe(
        data => {
          alert(data);
        }, error => {
          if (error.status === 200) {
            this.typeError = 'info';
            this.message = '  Parametro eliminato correttamente';
            this.error.next();
            this.elenco();
            return;
          } else {
            this.typeError = 'danger';
            this.message = '  Errore nell\'eliminazione del parametro';
            this.error.next();
            return;
          }
        }
      );
    }

  }

  confirmElimina(x: Parametro) {
    this.parametroSelezionato = x;
    this.modalRef = this.modal.open(ConfirmDialogComponent, {backdrop: 'static', keyboard: false, size: 'lg'});
    this.modalRef.componentInstance.modalRef = this.modalRef;
    this.modalRef.componentInstance.contesto = 'PARAMETRO';
    this.modalRef.componentInstance.message = 'Vuoi eliminare il parametro ' + x.nome + '?';
  }


  nuovo() {
    this.parametroSelezionato = new Parametro();
    this.parametroSelezionato.dataInizio = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.jobState = 'DETTAGLIO';
    this.titoloDettaglio = 'CREA NUOVO PARAMETRO';
  }


  salva() {

    this.message = '';

    if (!this.parametroSelezionato.nome || this.parametroSelezionato.nome.length === 0 || !this.parametroSelezionato.dataInizio
      || !this.parametroSelezionato.valoreDefault || this.parametroSelezionato.valoreDefault.length === 0) {
      this.typeError = 'danger';
      this.message = ' Inserire tutti i dati obbligatori';
      this.error.next();
      return;
    }

    const dataIn = new Date(this.parametroSelezionato.dataInizio);

    const userLogged = this.authservice.getUserLogged();
    if (userLogged) {
      if (!this.parametroSelezionato.id || this.parametroSelezionato.id === 0) {
        this.parametroSelezionato.userCreate = userLogged.USER_CF;
        this.parametroSelezionato.tmstCreate =  this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      } else {
        this.parametroSelezionato.userModify = userLogged.USER_CF;
        this.parametroSelezionato.tmstModify =  this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      }

    } else {
      this.typeError = 'danger';
      this.message = ' Nessun utente loggato';
      this.error.next();
      return;
    }


    this.service.salvaParametro(this.parametroSelezionato).subscribe(
      complete => {
        this.parametroSelezionato = new Parametro();
        this.jobState = 'ELENCO';
      }, error => {
        if (error.status !== 201) {
          this.typeError = 'danger';
          this.message = ' ' + error.statusText;
          this.error.next();
          return;
        } else {
          this.typeError = 'success';
          this.message = ' Parametro salvato correttamente!';
          this.error.next();
          this.parametroSelezionato = new Parametro();
          this.jobState = 'ELENCO';
          return;
        }

      }
    );

  }

  indietro() {
    this.message = '';
    this.parametroSelezionato = new Parametro();
    this.jobState = 'ELENCO';
  }

  getUnitaMisura(): Array<{ value: string, label: string }> {
    const unita = new Array<{ value: string, label: string }>();

    unita.push({value: '%', label: '%'});
    unita.push({value: '€', label: '€'});
    return unita;

  }

  getTipologieUniverso() {
    const codunorgs = this.authservice.codUnorg();
    return Costanti.getTipologieUniverso();
  }

  decodificaTipo(tipo) {
    return Costanti.decodificaTipoUniverso(tipo);
  }

}
