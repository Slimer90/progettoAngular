import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { ParametriComponent } from './parametri/parametri.component';
import { EstrazioneUniversoComponent } from './estrazione-universo/estrazione-universo.component';
import { ClassificaRigheComponent } from './classifica-righe/classifica-righe.component';
import { EstrazioneCampioneComponent } from './estrazione-campione/estrazione-campione.component';
import { CompletaCampioneComponent } from './completa-campione/completa-campione.component';
import { RegistrazioneEsitiComponent } from './registrazione-esiti/registrazione-esiti.component';
import { RisultanzeComponent } from './risultanze/risultanze.component';
import { AuthGuard } from './_guards';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { PaginaNonAutorizzatoComponent } from './pagina-non-autorizzato/pagina-non-autorizzato.component';
import { SelezionaProfiloComponent } from './seleziona-profilo/seleziona-profilo.component';




const routes: Routes = [
  { path: 'login', canActivateChild: [AuthGuard], component: LoginComponent,
      children: [
        { path: 'authResponseHandler', component: EstrazioneUniversoComponent}
      ]
  },
  { path: '', component: HomePageComponent, canActivate: [AuthGuard]},
  { path: 'non-autorizzato', component: PaginaNonAutorizzatoComponent},
  { path: 'parametri', component: ParametriComponent, canActivate: [AuthGuard]},
  { path: 'estrazione', component: EstrazioneUniversoComponent, canActivate: [AuthGuard]  },
  { path: 'completauniverso/:contesto', component: ClassificaRigheComponent , canActivate: [AuthGuard] },
  { path: 'estrazionecampione/:contesto', component: EstrazioneCampioneComponent, canActivate: [AuthGuard]},
  { path: 'completacampione/:contesto', component: CompletaCampioneComponent, canActivate: [AuthGuard]},
  { path: 'registraesito', component: RegistrazioneEsitiComponent, canActivate: [AuthGuard]},
  { path: 'risultanze', component: RisultanzeComponent, canActivate: [AuthGuard]},
  { path: 'token/:token', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'profilo', component: SelezionaProfiloComponent, canActivate: [AuthGuard] }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
