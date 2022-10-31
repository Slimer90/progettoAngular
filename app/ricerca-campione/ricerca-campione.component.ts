import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Campione} from '../model/campione';
import {NgxSpinnerService} from 'ngx-spinner';
import {CampionamentoService} from '../services/services';
import {Costanti} from '../util/costanti';
import {AuthenticationService} from '../services/authentication-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TipoUniverso} from '../model/universo';
import {Trimestre} from '../model/trimestre';
import {TrimestrAnno} from '../model/trimestreAnno';

@Component({
  selector: 'app-ricerca-campione',
  templateUrl: './ricerca-campione.component.html',
  styleUrls: ['./ricerca-campione.component.css']
})
export class RicercaCampioneComponent implements OnInit {

  @Input() contesto;
  @Output() emitRisultanze = new EventEmitter<Array<Campione>>();
  @Output() emitEsiti = new EventEmitter<Array<Campione>>();
  @Output() emitEstrazione = new EventEmitter<Array<Campione>>();

  formRicercCampione: FormGroup;

  tipologiaSelezionata;

  dataInizio: string;
  dataFine: string;
  message: string;
  listaTipiUniverso: TipoUniverso[];
  listaStatiCampione: { code: string, label: string }[];
  elencoTrimestri: Trimestre[];
  elencoAnni: TrimestrAnno[];
  listCampioni: Campione[] = [];


  constructor(private spinner: NgxSpinnerService,
              private fb: FormBuilder,
              private service: CampionamentoService) {
  }

  ngOnInit() {
    this.getTrimestri();
    this.listaStatiCampione = Costanti.getStatiCampione();

    this.listaTipiUniverso = Costanti.getTipologieUniverso();

    this.formRicercCampione = this.fb.group({
      tipologiaUniverso: [this.listaTipiUniverso[0].code, Validators.required],
      trimestre: ['', Validators.required],
    });

    if (this.contesto !== 'ESTRAZIONE' && !this.formRicercCampione.contains('statoCampione')) {
      this.formRicercCampione.registerControl('statoCampione', new FormControl(null, Validators.required));
    }

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

  getTrimestri() {
    if (this.elencoTrimestri != null && this.elencoTrimestri.length > 0) {
      return this.elencoTrimestri;
    } else {
      this.service.elencoTrimestri().subscribe(
        (data) => {
          this.elencoTrimestri = data;
        },
        (err) => {
          this.message = (typeof err.error === 'string') ? err.error : err.statusText;
        }
      );
    }
  }

  cercaCampione() {

    this.message = '';
    this.spinner.show();

    const {
      trimestre,
      tipologiaUniverso,
      statoCampione
    } = this.formRicercCampione.value;

    this.service.ricercaCampione(trimestre, tipologiaUniverso, statoCampione, this.contesto === 'RISULTANZE').subscribe(
      (data: Campione[]) => {
        this.listCampioni = data;

        if ('RISULTANZE' === this.contesto) {
          this.emitRisultanze.emit(this.listCampioni);
        } else if ('ESITI' === this.contesto) {
          this.emitEsiti.emit(this.listCampioni);
        } else if ('ESTRAZIONE' === this.contesto) {
          this.emitEstrazione.emit(this.listCampioni);
        }
        this.spinner.hide();
      }
    );

  }

}
