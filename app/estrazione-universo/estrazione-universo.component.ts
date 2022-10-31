import {Component, OnInit, ViewChild} from '@angular/core';
import {CampionamentoService} from '../services/services';
import {Subject} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {TipoUniverso, Universo} from '../model/universo';
import {DecimalPipe} from '@angular/common';
import {Costanti} from '../util/costanti';
import {AuthenticationService} from '../services/authentication-service';
import {Trimestre} from '../model/trimestre';
import {NgForm} from '@angular/forms';
import {TrimestrAnno} from '../model/trimestreAnno';

@Component({
  selector: 'app-estrazione-universo',
  templateUrl: './estrazione-universo.component.html',
  styleUrls: ['./estrazione-universo.component.css']
})
export class EstrazioneUniversoComponent implements OnInit {

  @ViewChild('formEstrazione', {static: false}) formEstrazione: NgForm;

  typeMessage: string;
  tipologieUniverso: TipoUniverso[];
  universoEstratto: Universo;
  message: string;
  elencoTrimestri: Trimestre[] = [];
  elencoAnni: TrimestrAnno[] = [];

  tipologiaSelezionata;

  constructor(
    private service: CampionamentoService,
    private spinner: NgxSpinnerService,
    private decimalPipe: DecimalPipe,
    private authservice: AuthenticationService
  ) {
  }

  ngOnInit() {

    this.tipologieUniverso = Costanti.getTipologieUniverso();
    this.tipologiaSelezionata = this.tipologieUniverso[0].code;
    this.getTrimestri();
    this.getAnni();
  }


  getTrimestri() {
    if (this.elencoTrimestri && this.elencoTrimestri.length > 0) {
      return this.elencoTrimestri;
    } else {
      this.service.elencoTrimestri().subscribe(
        (data) => {
          this.elencoTrimestri = <Trimestre[]>data;
          if (!data || data.length === 0) {
            this.message = 'Nessun trimetre trovato';
          }
        },
        (err) => {
          this.typeMessage = 'danger';
          this.message = err.error;
        }
      );
    }
  }


  getAnni() {
    if (this.elencoAnni && this.elencoAnni.length > 0) {
      return this.elencoAnni;
    } else {
      this.service.elencoAnni().subscribe(
        (data) => {
          if (!data || data.length === 0) {
            this.message = 'Nessun trimetre trovato';
          } else {
            this.elencoAnni = <TrimestrAnno[]>data;
          }
        },
        (err) => {
          this.typeMessage = 'danger';
          this.message = err.error;
        }
      );
    }
  }

  estraiUniverso(formValue: ParamEstrazioneUniverso) {

    this.spinner.show();
    this.message = '';

    const userlogged = this.authservice.getUserLogged();
    const codunorgs = this.authservice.codUnorg();

    this.service.estraiUniverso(formValue.tipologiaUniverso, formValue.trimestre, userlogged.USER_CF, codunorgs)
      .subscribe(
        (data: Universo) => {
          this.universoEstratto = data;
          this.spinner.hide();
        },
        (error) => {
          if (error.status === 419) {
            this.typeMessage = 'danger';
            this.message = 'L\'universo di tipo ' + Costanti.decodificaTipoUniverso(formValue.tipologiaUniverso)
              + ' per il trimestre ' + formValue.trimestre + ' è stato estratto precedentemente.';
          } else if (error.status === 421) {
            this.typeMessage = 'warning';
            this.message = 'Nessun dato estratto per la tipologia e il trimestre selezionati';
          } else if (error.status === 423) {
            this.typeMessage = 'danger';
            this.message = 'Trimestre non valido';
          } else if (error.status === 425) {
            this.typeMessage = 'danger';
            this.message = 'Non sei autorizzato all\'estrazione degli universi della tipologia selezionata.';
          } else if (error.status === 426) {
            this.typeMessage = 'danger';
            this.message = error.error;
          } else {
            this.typeMessage = 'danger';
            this.message = error.error.message;
          }
          this.spinner.hide();
          return;
        }
      );
  }

  nuovaEstrazione() {
    this.formEstrazione.form.patchValue({
      tipologiaUniverso: this.tipologieUniverso[0].code,
      trimestre: ''
    });
    this.universoEstratto = null;
  }

}

interface ParamEstrazioneUniverso {
  tipologiaUniverso: string;
  trimestre: number;
}
