import {Component, OnInit} from '@angular/core';
import {CampionamentoService} from '../services/services';
import {Subject} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {DatePipe} from '@angular/common';
import {NgxSpinnerService} from 'ngx-spinner';
import {RigaUniverso} from '../model/riga-universo';
import {Costanti} from '../util/costanti';
import {TipoUniverso, Universo} from '../model/universo';
import {AuthenticationService} from '../services/authentication-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Trimestre} from '../model/trimestre';
import {TrimestrAnno} from '../model/trimestreAnno';
import {TipoElencoEnum} from '../model/enums/tipoElencoEnum';
import {CampElencoCodaRequest} from '../model/request/campElencoCodaRequest';
import {CampElencoCodaResponse} from '../model/campElencoResponse';
import {DynamicComponentData} from '../model/class/dynamic-component';
import {DataDownloadFile} from '../model/dataDownloadFile';
import {ModalConfig} from '../components/generic-message/generic-message.component';
import {TimerComponent} from '../components/timer/timer.component';
import {StampaService} from '../services/stampa.service';
import {DynamicHelperService} from '../services/dynamic-helper.service';

@Component({
  selector: 'app-classifica-righe',
  templateUrl: './classifica-righe.component.html',
  styleUrls: ['./classifica-righe.component.css']
})
export class ClassificaRigheComponent implements OnInit {

  formRicercaUniverso: FormGroup;

  elencoTrimestri: Trimestre[];
  elencoAnni: TrimestrAnno[];
  contesto: string;
  message: string;
  error = new Subject();
  listaUniverso: Universo[];
  typeError: string;
  tipologieUniverso: TipoUniverso[];
  listRigheUniverso: RigaUniverso[] = [];
  rigaSelezionata: RigaUniverso;
  tipologiaSelezionata;

  tipoElencoEnum = TipoElencoEnum;


  constructor(private service: CampionamentoService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private stampaService: StampaService,
              private dynamicHelperService: DynamicHelperService,
              private datePipe: DatePipe,
              private spinner: NgxSpinnerService,
              private authservice: AuthenticationService) {
  }

  ngOnInit() {

    this.tipologieUniverso = Costanti.getTipologieUniverso();

    this.formRicercaUniverso = this.fb.group({
      tipologiaUniverso: [this.tipologieUniverso[0]?.code, Validators.required],
      trimestre: [null, Validators.required]
    });

    this.tipologiaSelezionata = this.tipologieUniverso[0].code;

    this.route.params.subscribe(
      (param: Params) => {
        this.contesto = param['contesto'];
      }
    );

    // Recupero i trimestri dal server
    this.spinner.show();
    this.service.elencoTrimestri().subscribe(
      (data) => {
        this.elencoTrimestri = data;
        this.spinner.hide();
      },
      (error) => {
        console.error('[CLASSIFICA-RIGHE.COMPONENT] recupera trimestri error :: ', error);
        this.spinner.hide();
      }
    );

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

    this.formRicercaUniverso.get('tipologiaUniverso').valueChanges.subscribe(
      () => this.resetUniverso()
    );

    this.formRicercaUniverso.get('trimestre').valueChanges.subscribe(
      () => this.resetUniverso()
    );

  }

  resetUniverso() {
    if (this.listaUniverso != null) {
      this.formRicercaUniverso.get('universoSelezionato').setValue(null);
      this.listaUniverso = undefined;
      this.listRigheUniverso = undefined;
    }
  }

  ricercaUniverso() {

    this.spinner.show();

    this.message = '';

    const {trimestre, tipologiaUniverso} = this.formRicercaUniverso.value;

    this.service.ricercaUniverso(trimestre, tipologiaUniverso).subscribe(
      (data: Universo[]) => {
        if (data === undefined || data.length === 0) {
          this.message = 'Nessun dato trovato!';
          this.typeError = 'warning';
        } else {
          this.listaUniverso = data;
          if (this.formRicercaUniverso.contains('universoSelezionato')) {
            this.formRicercaUniverso.get('universoSelezionato').setValue(data[0]);
          } else {
            this.formRicercaUniverso.addControl('universoSelezionato', new FormControl(data[0], Validators.required));
          }
        }
        this.spinner.hide();
      },
      (error) => {
        this.message = ' ' + error.statusText;
        this.typeError = 'danger';
        this.spinner.hide();
      }
    );

  }

  ricaricaRigheUniverso() {

    this.message = '';

    this.spinner.show();

    this.service.ricercaRigheUniverso(this.formRicercaUniverso.value.universoSelezionato.id).subscribe(
      (data: RigaUniverso[]) => {
        this.listRigheUniverso = data;
        this.spinner.hide();
      }
    );

  }

  dettaglioRiga(rigaUniverso: RigaUniverso) {
    this.rigaSelezionata = rigaUniverso;
    this.rigaSelezionata.dataEstrazione = this.datePipe.transform(rigaUniverso.dataEstrazione, 'yyyy-MM-dd');
  }

  changeDimensioneIntervento(newDimension: string) {
    this.rigaSelezionata.dimensioneIntervento = newDimension;
  }

  changeCodiceRischio(newCode: string) {
    this.rigaSelezionata.codiceRischio = newCode;
  }

  annulla() {
    this.rigaSelezionata = null;
    this.message = '';
  }

  salva() {
    this.spinner.show();

    const userLogged = this.authservice.getUserLogged();
    if (userLogged) {
      this.rigaSelezionata.userModify = userLogged.USER_CF;
    }
    this.rigaSelezionata.tmstModify = new Date();

    this.service.salvaRigaUniverso(this.rigaSelezionata).subscribe(
      (data) => {
        this.message = data.message;
        this.typeError = 'info';
        this.spinner.hide();
      },
      (error) => {
        this.message = error.statusText;
        this.typeError = 'danger';
        this.spinner.hide();
      }
    );
  }

  produciElenco(tipoElenco: TipoElencoEnum.UNIVERSO) {

    const universo: Universo = this.formRicercaUniverso.get('universoSelezionato').value;
    if (universo == null) {

      this.typeError = 'danger';
      this.message = 'Dati per la richiesta errati!';

    } else {

      const request = {
        tipoElenco,
        idElenco: universo.id
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

            data.data = {...response, name: `ElencoUniverso${universo.id}.xlsx`};
            this.dynamicHelperService.selectComponent(TimerComponent, data, style);

          },
          (error) => {
            this.spinner.hide();
            alert('error');
          }
        );
    }
  }

}
