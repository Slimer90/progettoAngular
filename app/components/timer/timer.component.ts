import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {interval, Observable, of, Subscription, timer} from 'rxjs';
import {StampaService} from '../../services/stampa.service';
import {DynamicComponentData} from '../../model/class/dynamic-component';
import {CampElencoCodaResponse, StatoCodaEnum} from '../../model/campElencoResponse';
import {DataDownloadFile} from '../../model/dataDownloadFile';
import {catchError, distinctUntilKeyChanged, filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {DynamicHelperService} from '../../services/dynamic-helper.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {animateCSS} from '../../util/functionUtility';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {

  @Input() data: DynamicComponentData<CampElencoCodaResponse & DataDownloadFile>;
  @ViewChild('statoCodaEl') statoCodaEl: ElementRef<HTMLParagraphElement>;
  @ViewChild('noteEl') noteEl: ElementRef<HTMLParagraphElement>;

  stato: StatoCodaEnum;
  enableDownload = false;
  note = '';
  colorText: string;
  time = '0s';
  seconds = 0;
  minutes = 0;
  hours = 0;

  STATO_ENUM = StatoCodaEnum;

  interval$: Observable<number> = interval(1000);
  pooling$: Observable<string>;

  _subscription: Subscription[] = [];

  constructor(private stampaService: StampaService,
              private spinner: NgxSpinnerService,
              private dynamicHelperService: DynamicHelperService
  ) {
  }

  ngOnInit(): void {
    this.firstCheckStato();
  }

  firstCheckStato() {
    // Faccio il primo controllo dello stato
    this._subscription.push(this.stampaService.controlloStato(this.data.data.id)
      .pipe(
       distinctUntilKeyChanged('stato')
      ).subscribe((response: CampElencoCodaResponse) => {
        this.stato = response.stato;
        animateCSS(this.statoCodaEl, 'bounceIn');
        this.init();
      })
    );
  }

  init() {
    switch (this.stato) {
      case StatoCodaEnum.RICEVUTO: {
        this.firstCheckStato();
        break;
      }
      case StatoCodaEnum.AVVIATO: {
        this.note = 'Processo avviato correttamente, attendere il completamento della procedura';
        animateCSS(this.noteEl, 'bounceIn');

        this.colorText = 'text-warning';

        this.pooling$ = this.getPooling();
        // Avvio il conteggio del tempo di esecuzione
        this._subscription.push(
          this.interval$.pipe(
            takeUntil(this.pooling$)
          ).subscribe(seconds => {

            if (seconds < 60) {
              this.seconds = seconds;
              this.time = seconds + 's';
            } else if (seconds >= 60) {
              this.seconds = seconds % 60;
              this.minutes = Math.trunc(seconds / 60);

              if (this.minutes < 60) {
                this.time = this.minutes + 'm ' + this.seconds + 's';
              } else {
                this.minutes = this.minutes % 60;
                this.hours = Math.trunc(this.minutes / 60);
                this.time = this.hours + 'h ' + this.minutes + 'm ' + this.seconds + 's';
              }
            }
          })
        );

        break;
      }
      case StatoCodaEnum.CONCLUSO: {
        this.procedureConcluded();
        break;
      }
      case StatoCodaEnum.ERRORE: {
        this.procedureFailed();
        break;
      }
      default:
        break;
    }
  }

  getPooling(): Observable<string> {

    return timer(0, 5000)
      .pipe(
        switchMap(() => this.stampaService.controlloStato(this.data.data.id).pipe(
          catchError(error => {
            return of({stato: StatoCodaEnum.ERRORE} as CampElencoCodaResponse);
          })
        )),
        filter((response: CampElencoCodaResponse) => response.stato === StatoCodaEnum.CONCLUSO || response.stato === StatoCodaEnum.ERRORE),
        map((response: CampElencoCodaResponse) => {
          switch (response.stato) {
            case StatoCodaEnum.CONCLUSO: {
              animateCSS(this.statoCodaEl, 'bounceIn');
              this.procedureConcluded();
              break;
            }
            case StatoCodaEnum.ERRORE: {
              animateCSS(this.statoCodaEl, 'bounceIn');
              this.procedureFailed();
              break;
            }
            default:
              break;
          }
          return this.stato = response.stato;
        })
      );
  }

  procedureConcluded() {
    this.dynamicHelperService.toggleClosable();
    this.enableDownload = true;
    this.note = 'Processo concluso. Premere sull\'apposito pulsante per il download del file.';
    this.colorText = 'text-success';
    animateCSS(this.noteEl, 'bounceIn');
  }

  procedureFailed() {
    this.dynamicHelperService.toggleClosable();
    this.note = 'Errore nella procedura';
    this.colorText = 'text-danger';
    animateCSS(this.noteEl, 'bounceIn');
  }

  downloadFile() {
    this.spinner.show();
    this.stampaService.recuperaFile(this.data.data.id).subscribe(
      (base64: string) => {
        // const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,';
        this.stampaService.downloadFile(base64, this.data.data.name);
        this.spinner.hide();
        this.dynamicHelperService.toggleModal();
      },
      error => {
        this.spinner.hide();
        this.dynamicHelperService.toggleModal();
        alert('Impossibile stampare il documento');
      });

  }

  ngOnDestroy(): void {
    this._subscription.forEach((sub: Subscription) => sub.unsubscribe());
  }


}
