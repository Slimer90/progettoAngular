import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {AuthenticationService} from '../services/authentication-service';
import {Router} from '@angular/router';
import {Profilo} from '../model/profilo';
import {FormControl, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-seleziona-profilo',
  templateUrl: './seleziona-profilo.component.html',
  styleUrls: ['./seleziona-profilo.component.css']
})
export class SelezionaProfiloComponent implements OnInit {

  message: string;
  codUnorgs: Profilo[] = [];
  profiloSelezionato = new FormControl(null, Validators.required);
  typeMessage: string;


  constructor(private authService: AuthenticationService, private router: Router, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.message = '';
    this.spinner.show();

    const userLogged = this.authService.getUserLogged();
    if (userLogged) {
      const codunorgs = this.authService.getCodUnorgs(userLogged.USER_CF);
      codunorgs.subscribe(
        data => {
          if (data == null || data.length === 0) {
            this.message = 'Nessun profilo associato!';
            this.typeMessage = 'danger';
          } else {
            this.codUnorgs = data;
          }
          this.spinner.hide();
        },
        () => {
          this.message = 'Si è verificato un errore!';
          this.typeMessage = 'danger';
          this.spinner.hide();
        }
      );
    }
  }

  conferma() {
    if (this.profiloSelezionato.value != null) {
      sessionStorage.setItem('codUnorg', this.profiloSelezionato.value.cod);
      sessionStorage.setItem('codUnorgDescr', this.profiloSelezionato.value.descrizione);
      this.authService.confermaProfilo.emit(this.profiloSelezionato.value);
      this.router.navigate(['']);
    } else {
      this.message = 'Selezionare un profilo!';
      this.typeMessage = 'danger';
    }

  }

}
