import {Component, OnInit} from '@angular/core';
import {CampionamentoService} from '../services/services';
import {Subject} from 'rxjs';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Campione} from '../model/campione';
import {TipoUniverso, Universo} from '../model/universo';
import {Costanti} from '../util/costanti';
import {Parametro} from '../model/parametro';
import {NgbModalRef, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {AuthenticationService} from '../services/authentication-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Trimestre} from '../model/trimestre';
import {CriterioCampionamento} from '../model/criterioCampionamento';
import { TrimestrAnno } from '../model/trimestreAnno';

@Component({
  selector: 'app-estrazione-campione',
  templateUrl: './estrazione-campione.component.html',
  styleUrls: ['./estrazione-campione.component.css']
})
export class EstrazioneCampioneComponent implements OnInit {

  contestoRicerca = 'ESTRAZIONE';
  contesto: string;
  message: string;
  typeError;
  elencoParametri;
  campioneSelezionato: Campione;
  inizializza = true;
  listCampioni = [];
  idCampioneSelezionato;
  listRigheCampione;
  listCriteriCampionamento;

  modalRef: NgbModalRef;
  elencoCriteriCampionamento: CriterioCampionamento[] = [];
  formRicercaCampione: FormGroup;
  listaTipiUniverso: TipoUniverso[] = Costanti.getTipologieUniverso();
  elencoTrimestri: Trimestre[];
  elencoAnni : TrimestrAnno[];
  listaUniversi: Universo[];
  universoSelezionato: Universo;

  tipologiaSelezionata;


  constructor(private service: CampionamentoService,
              private datePipe: DatePipe, private route: ActivatedRoute,
              private spinner: NgxSpinnerService, private router: Router,
              private fb: FormBuilder,
              private modal: NgbModal, private authservice: AuthenticationService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (p) => {
        if (this.inizializza) {
          this.idCampioneSelezionato = 0;
          this.universoSelezionato = null;
          this.listCampioni = [];
          this.listCriteriCampionamento = [];
          this.listRigheCampione = [];
        }
        this.contesto = p.get('contesto');
        this.inizializza = true;
      }
    );

    this.formRicercaCampione = this.fb.group({
      tipologiaUniverso: [this.listaTipiUniverso[0].code, Validators.required],
      trimestre: ['', Validators.required]
    });

    this.spinner.show();
    this.service.elencoTrimestri().subscribe(
      (data: Trimestre[]) => {
        this.elencoTrimestri = data;
        this.spinner.hide();
      },
      (err) => {
        this.typeError = 'danger';
        this.message = err.error;
        this.spinner.hide();
      });

      this.service.elencoAnni().subscribe(
        (data: TrimestrAnno[]) => {
          this.elencoAnni = data;
          this.spinner.hide();
        },
        (err) => {
          this.typeError = 'danger';
          this.message = err.error;
          this.spinner.hide();
        });

    this.service.eliminaCampioneEmitter.subscribe(
      (o) => {
        if (o === this.idCampioneSelezionato) {
          this.eliminaCampione();
        }
      }
    );

    this.formRicercaCampione.get('tipologiaUniverso').valueChanges.subscribe(() => {
      if (this.listaUniversi) {
        this.formRicercaCampione.get('idUniversoSelezionato').setValue('');
        this.listaUniversi = [];
      }
    });

    this.formRicercaCampione.get('trimestre').valueChanges.subscribe(() => {
      if (this.listaUniversi) {
        this.formRicercaCampione.get('idUniversoSelezionato').setValue('');
        this.listaUniversi = [];
      }
    });

  }


  /*
    getListaUniversi() {
      this.message = '';
      if (!this.listUniversi || this.listUniversi.length === 0) {
        this.service.ricercaUniverso('', this.tipologiaUniverso).subscribe(
          (data: Array<any>) => {
            this.listUniversi = data;
            return data;
          },
          (error) => {
            this.message = ' ' + error.statusText;
            this.typeError = 'danger';
            return null;
          }
        );
      } else {
        return this.listUniversi;
      }
    }
  */

  ricercaUniverso() {

    this.spinner.show();
    this.message = '';

    const {trimestre, tipologiaUniverso} = this.formRicercaCampione.value;

    this.service.ricercaUniverso(trimestre, tipologiaUniverso).subscribe(
      (data: Universo[]) => {
        if (!data || data.length === 0) {
          this.message = 'Nessun dato trovato';
          this.typeError = 'warning';
        } else {
          this.listaUniversi = data;
          if (!this.formRicercaCampione.contains('idUniversoSelezionato')) {
            this.formRicercaCampione.registerControl('idUniversoSelezionato', new FormControl(data[0].id, Validators.required));
          } else {
            this.formRicercaCampione.controls.idUniversoSelezionato.setValue(data[0].id);
          }
        }
        this.spinner.hide();
      },
      (error) => {
        this.message = ' ' + error.error ? error.error : error.statusText;
        this.typeError = 'danger';
        this.spinner.hide();
      }
    );
  }

  selezionaUniverso() {

    this.message = '';
    this.elencoParametri = [];
    const {idUniversoSelezionato} = this.formRicercaCampione.value;

    this.universoSelezionato = this.listaUniversi.find(u => u.id === idUniversoSelezionato);
    this.universoSelezionato.dataDal = this.datePipe.transform(this.universoSelezionato.dataDal, 'yyyy-MM-dd');
    this.universoSelezionato.dataAl = this.datePipe.transform(this.universoSelezionato.dataAl, 'yyyy-MM-dd');

    this.creaCriteri();
  }

  creaCriteri() {
    this.spinner.show();

    this.service.elencoParametri('', '', true, this.universoSelezionato.tipoUniverso)
      .subscribe((data: Parametro[]) => {
          this.elencoParametri = data;
          if (this.idCampioneSelezionato > 0) {
            for (const criterio of this.listCriteriCampionamento) {
              criterio.selected = true;
              this.elencoCriteriCampionamento.push(criterio);
            }
          }
          for (const parametro of this.elencoParametri) {
            let trovato = false;
            for (const criterio of this.elencoCriteriCampionamento) {
              if (criterio.parametro.id === parametro.id) {
                trovato = true;
              }
            }
            if (!trovato) {
              const criterio = new CriterioCampionamento();
              criterio.parametro = parametro;
              this.elencoCriteriCampionamento.push(criterio);
            }
          }
          this.spinner.hide();
        }, (error) => {
          this.typeError = 'danger';
          this.message = error.statusText;
          this.spinner.hide();
        }
      );
  }


  estraiRigheCampione() {

    this.message = '';
    if (this.idCampioneSelezionato > 0) {
      this.spinner.show();
      this.service.estraiRigheCampione(this.idCampioneSelezionato).subscribe(
        (data: Campione) => {
          this.message = ' Operazione terminata con successo. Aggiornato campione num. ' + data.id + ' \n Totale righe estratte: ' + data.totRigheCampione;
          this.typeError = 'info';
          this.spinner.hide();
          this.campioneSelezionato = data;
          this.campioneSelezionato.dataEstrazione = this.datePipe.transform(this.campioneSelezionato.dataEstrazione, 'yyyy-MM-dd');

          // this.listRigheCampione=data.righeCampione;
          this.service.listRigheCampione(this.campioneSelezionato.id).subscribe(
            (obj) => {
              this.listRigheCampione = obj;

              this.campioneSelezionato.righeClasse1 = 0;
              this.campioneSelezionato.righeClasse2 = 0;
              this.campioneSelezionato.righeClasse3 = 0;
              for (const x of this.listRigheCampione) {
                if (x.codiceRischio === '1') {
                  this.campioneSelezionato.righeClasse1 = this.campioneSelezionato.righeClasse1 + 1;
                } else if (x.codiceRischio === '2') {
                  this.campioneSelezionato.righeClasse2 = this.campioneSelezionato.righeClasse2 + 1;
                } else if (x.codiceRischio === '3') {
                  this.campioneSelezionato.righeClasse3 = this.campioneSelezionato.righeClasse3 + 1;
                }
              }

            }
          );

        }, error => {
          this.spinner.hide();
          if (499 === error.status) {
            this.message = 'Inserire i parametri necessari';
          } else if (498 === error.status) {
            this.message = 'Correggere il campo riferito del parametro VALORE_SOGLIA';
          } else {
            this.message = 'Errore durante l\'estrazione del campione';
          }
          this.typeError = 'danger';
        }
      );
    } else {
      this.salva(true);
    }

  }


  salva(estrai: boolean) {

    // inserire controlli

    this.spinner.show();

    this.message = '';

    this.idCampioneSelezionato = this.campioneSelezionato != null ? this.campioneSelezionato.id : 0;

    const {idUniversoSelezionato} = this.formRicercaCampione.value;

    this.service.salvaCriteriCampione(idUniversoSelezionato, this.idCampioneSelezionato, this.elencoCriteriCampionamento).subscribe(
      (idCampione: number) => {
        this.idCampioneSelezionato = idCampione;
        if (estrai) {
          this.estraiRigheCampione();
        } else {
          this.message = ' Operazione effettuata con successo';
          this.typeError = 'info';
          this.vaiEstrazioneCampione();
        }
        this.spinner.hide();
      }, (error) => {
        if (499 === error.status) {
          this.message = error.error;
        } else if (498 === error.status) {
          this.message = 'Si è verificato un errore';
        } else {
          this.message = error.statusText;
        }
        this.typeError = 'danger';
        this.spinner.hide();


      }
    );
  }

  elencoCampione() {
    this.spinner.show();
    this.message = '';

    const {trimestre, tipologiaUniverso} = this.formRicercaCampione.value;

    this.service.ricercaCampione(trimestre, tipologiaUniverso, '', false).subscribe(
      (data: Array<any>) => {
        this.listCampioni = data;
        if (!this.listCampioni || this.listCampioni.length === 0) {
          this.message = ' Nessun dato trovato';
          this.typeError = 'warning';
          return;
        }
        this.spinner.hide();
      }
    );
  }

  selezionaCampione(x) {

    this.campioneSelezionato = x;
    this.campioneSelezionato.dataEstrazione = this.datePipe.transform(x.dataEstrazione, 'yyyy-MM-dd');
    this.idCampioneSelezionato = x.id;

    this.service.listRigheCampione(this.campioneSelezionato.id).subscribe(
      (data) => {
        this.listRigheCampione = data;

        this.campioneSelezionato.righeClasse1 = 0;
        this.campioneSelezionato.righeClasse2 = 0;
        this.campioneSelezionato.righeClasse3 = 0;
        for (const row of this.listRigheCampione) {
          if (row.codiceRischio === '1') {
            this.campioneSelezionato.righeClasse1 = this.campioneSelezionato.righeClasse1 + 1;
          } else if (row.codiceRischio === '2') {
            this.campioneSelezionato.righeClasse2 = this.campioneSelezionato.righeClasse2 + 1;
          } else if (row.codiceRischio === '3') {
            this.campioneSelezionato.righeClasse3 = this.campioneSelezionato.righeClasse3 + 1;
          }
        }
      }
    );

    this.service.listCriteriCampionamento(this.campioneSelezionato.id).subscribe(
      (data) => {
        this.listCriteriCampionamento = data;
      }
    );


  }

  annulla() {
    this.message = '';
    this.campioneSelezionato = undefined;
  }

  getListaCampioni(list: Array<Campione>) {
    this.listCampioni = list;

    if (!this.listCampioni || this.listCampioni.length === 0) {
      this.message = ' Nessun dato trovato';
      this.typeError = 'warning';
    }
  }

  decodificaTipoUniverso(tipo) {
    return Costanti.decodificaTipoUniverso(tipo);
  }

// attualmente non utilizzati
  /*vaiGestioneParametri() {
    this.router.navigate(['parametri']);
  }*/

  /*aggiungiCriterio() {
    this.inizializza = false;
    this.router.navigate(['/estrazionecampione/definiscicriteri']);
    this.universoSelezionato = this.campioneSelezionato.universo;
    this.creaCriteri();
  }*/

  dettaglioCampione() {

    this.service.dettaglioCampione(this.idCampioneSelezionato).subscribe(
      (data: Campione) => {
        this.campioneSelezionato = data;

        if (this.campioneSelezionato.dataEstrazione) {
          this.service.listRigheCampione(this.campioneSelezionato.id).subscribe(
            (obj) => {
              this.listRigheCampione = obj;

              this.campioneSelezionato.righeClasse1 = 0;
              this.campioneSelezionato.righeClasse2 = 0;
              this.campioneSelezionato.righeClasse3 = 0;
              for (const x of this.listRigheCampione) {
                if (x.codiceRischio === '1') {
                  this.campioneSelezionato.righeClasse1 = this.campioneSelezionato.righeClasse1 + 1;
                } else if (x.codiceRischio === '2') {
                  this.campioneSelezionato.righeClasse2 = this.campioneSelezionato.righeClasse2 + 1;
                } else if (x.codiceRischio === '3') {
                  this.campioneSelezionato.righeClasse3 = this.campioneSelezionato.righeClasse3 + 1;
                }
              }
            }
          );
        }
        this.service.listCriteriCampionamento(this.campioneSelezionato.id).subscribe(
          (listaCriteri: CriterioCampionamento[]) => {
            this.listCriteriCampionamento = listaCriteri;
          }
        );
      });
  }


  vaiEstrazioneCampione() {
    this.message = '';
    this.inizializza = false;
    this.dettaglioCampione();
    this.router.navigate(['/estrazionecampione/estrairighe']);
  }


  eliminaCampione() {
    this.service.eliminaCampione(this.idCampioneSelezionato).subscribe(
      (error) => {
        this.typeError = 'danger';
        this.message = 'Impossibile completare l\'operazione';
        return;
      }, () => {
        this.campioneSelezionato = null;
        this.listCampioni = new Array<Campione>();
        this.typeError = 'success';
        this.message = 'Operazione effettuata con successo';
        return;
      }
    );
  }

  confirmElimina() {

    this.modalRef = this.modal.open(ConfirmDialogComponent, {backdrop: 'static', keyboard: false, size: 'lg'});
    this.modalRef.componentInstance.modalRef = this.modalRef;
    this.modalRef.componentInstance.contesto = 'ELIMINACAMPIONE';
    this.modalRef.componentInstance.message = 'Vuoi eliminare il campione?';
    this.modalRef.componentInstance.id = this.idCampioneSelezionato;
  }

  annullaCreaCampione() {
    this.universoSelezionato = undefined;

  }


  decodificaStato(stato) {
    return Costanti.decodificaStato(stato);
  }


  public isProfiloAdg() {
    const codunorgs = this.authservice.codUnorg();
    return codunorgs === 'AdG';

  }
}
