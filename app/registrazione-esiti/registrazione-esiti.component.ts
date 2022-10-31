import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {CampionamentoService} from '../services/services';
import {Campione} from '../model/campione';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {RigaCampione} from '../model/riga-campione';

@Component({
  selector: 'app-registrazione-esiti',
  templateUrl: './registrazione-esiti.component.html',
  styleUrls: ['./registrazione-esiti.component.css']
})
export class RegistrazioneEsitiComponent implements OnInit {

  typeError;
  message;
  error = new Subject();
  campioneChiuso;
  listCampioni = new Array<Campione>();
  campioneSelezionato: Campione;
  listRigheCampione = new Array<RigaCampione>();
  rigaSelezionata;
  modalRef: NgbModalRef;
  contesto = 'ESITI';



  constructor(private spinner: NgxSpinnerService, private service: CampionamentoService, private modal: NgbModal) {
    this.service.aaggiornaCampioneEmitter.subscribe(
      () => this.salvaCampione()
    );
  }

  ngOnInit() {
  }


  getEsito() {
    const esito = new Array<{ code: string, label: string }>();
    esito.push({code: '', label: 'Nessun esito'});
    esito.push({code: 'OK', label: 'Esito positivo'});
    esito.push({code: 'KO', label: 'Esito negativo'});
    esito.push({code: 'PR', label: 'Prescrizione'});
    return esito;
  }

  acquisisciEsito(x) {
    this.spinner.show();

    this.campioneSelezionato = x;

    this.service.listRigheCampione(x.id).subscribe(
      (data: Array<RigaCampione>) => {
        this.listRigheCampione = data;

        this.spinner.hide();
      }
    );
  }

  dettaglioRiga(x) {

    this.rigaSelezionata = x;
  }

  riapriCampione(x) {
    this.campioneChiuso = x;

    this.modalRef = this.modal.open(ConfirmDialogComponent, {backdrop: 'static', keyboard: false, size: 'lg'});
    this.modalRef.componentInstance.modalRef = this.modalRef;
    this.modalRef.componentInstance.contesto = 'ESITO';
    this.modalRef.componentInstance.message = 'Lo stato del campione verrà modificato ad APERTO. Vuoi continuare?';
  }

  salvaCampione() {
    this.spinner.show();
    this.campioneChiuso.stato = 'AP';
    this.service.salvaCampione(this.campioneChiuso).subscribe(
      (error) => {
        this.typeError = 'danger';
        this.message = ' Si è verificato un errore';
        this.error.next();
        this.spinner.hide();
      },
      (data) => {
        this.typeError = 'info';
        this.message = ' Operazione effettuata con successo';
        this.error.next();
        this.spinner.hide();
      }
    );
  }

  tornaPaginaIniziale() {
    this.campioneSelezionato = null;
  }

  tornaElencoRighe() {
    this.rigaSelezionata = null;
  }

  salvaRiga() {
    this.spinner.show();

    if (!this.rigaSelezionata.dataControllo) {
      this.typeError = 'danger';
      this.message = 'Inserire data controllo';
      this.error.next();
      this.spinner.hide();
      return;
    }

    if (!this.rigaSelezionata.esitoControllo) {
      this.typeError = 'danger';
      this.message = 'Inserire esito';
      this.error.next();
      this.spinner.hide();
      return;
    }

    if (this.rigaSelezionata.esitoControllo === 'PR' && !this.rigaSelezionata.prescrizione) {
      this.typeError = 'danger';
      this.message = 'Inserire le note di prescrizione';
      this.error.next();
      this.spinner.hide();
      return;
    }

    this.service.salvaRigaCampione(this.rigaSelezionata).subscribe(
      (data) => {
        this.typeError = 'info';
        this.message = 'Operazione effettuata con successo';
        this.error.next();
        this.spinner.hide();
      },
      (error) => {
        this.typeError = 'danger';
        this.message = error.statusText;
        this.error.next();
        this.spinner.hide();
      }
    );
  }

  getListaCampioni(list: Array<Campione>) {
    this.listCampioni = list;
  }

}
