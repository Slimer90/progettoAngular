import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CommonModule, DatePipe, DecimalPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

import {JwtInterceptor} from './_helpers';

import {AppComponent} from './app.component';
import {ParametriComponent} from './parametri/parametri.component';
import {HeaderComponent} from './header/header.component';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {EstrazioneUniversoComponent} from './estrazione-universo/estrazione-universo.component';
import {ClassificaRigheComponent} from './classifica-righe/classifica-righe.component';
import {EstrazioneCampioneComponent} from './estrazione-campione/estrazione-campione.component';
import {CompletaCampioneComponent} from './completa-campione/completa-campione.component';
import {RegistrazioneEsitiComponent} from './registrazione-esiti/registrazione-esiti.component';
import {RisultanzeComponent} from './risultanze/risultanze.component';
import {RicercaCampioneComponent} from './ricerca-campione/ricerca-campione.component';
import {HomePageComponent} from './home-page/home-page.component';
import {LoginComponent} from './login/login.component';
import {PaginaNonAutorizzatoComponent} from './pagina-non-autorizzato/pagina-non-autorizzato.component';
import {SelezionaProfiloComponent} from './seleziona-profilo/seleziona-profilo.component';
import { NoteVerbaleComponent } from './note-verbale/note-verbale.component';

import {CampionamentoService} from './services/services';
import {AppRoutingModule} from './app-routing-module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgxDataTableModule} from 'angular-9-datatable';
import {NumberDirective} from './directive/numbers-only.directive';
import {ItDecimalPipe} from './util/it-decimal-pipe';
import {AppConfigService} from './services/app-config.service';
import {AuthGuard} from './_guards';
import { GenericMessageComponent } from './components/generic-message/generic-message.component';
import { BackdropComponent } from './components/backdrop/backdrop.component';
import { TimerComponent } from './components/timer/timer.component';
import { DynamicComponentDirective } from './directive/dynamic-component.directive';



const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};


@NgModule({
  declarations: [
    AppComponent,
    ParametriComponent,
    HeaderComponent,
    ConfirmDialogComponent,
    EstrazioneUniversoComponent,
    ClassificaRigheComponent,
    EstrazioneCampioneComponent,
    CompletaCampioneComponent,
    NumberDirective,
    RegistrazioneEsitiComponent,
    RisultanzeComponent,
    RicercaCampioneComponent,
    HomePageComponent,
    ItDecimalPipe,
    LoginComponent,
    PaginaNonAutorizzatoComponent,
    SelezionaProfiloComponent,
    NoteVerbaleComponent,
    GenericMessageComponent,
    BackdropComponent,
    TimerComponent,
    DynamicComponentDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    NgbAlertModule,
    NgxSpinnerModule,
    NgxDataTableModule,
    CommonModule

  ],
  providers: [
    CampionamentoService,
    DatePipe,
    DecimalPipe,
    AuthGuard,
    ItDecimalPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    }],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent, NoteVerbaleComponent, TimerComponent]
})

export class AppModule {
}
