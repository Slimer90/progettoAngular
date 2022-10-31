import {Component, OnInit} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CampionamentoService} from '../services/services';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  modalRef: NgbModalRef;
  contesto: string;
  message: string;
  id: number;



  constructor(private service: CampionamentoService) {
  }

  conferma() {

    if ('PARAMETRO' === this.contesto) {
      this.service.eliminaParametroEmitter.emit();
    } else if ('COMPLETACAMPIONE' === this.contesto) {
      this.service.aggiungiAlCampioneEmitter.emit();
    } else if ('ESITO' === this.contesto) {
      this.service.aaggiornaCampioneEmitter.emit();
    } else if ('VERBALE' === this.contesto) {
      this.service.produciVerbaleEmitter.emit();
    } else if ('ELIMINACAMPIONE' === this.contesto) {
      this.service.eliminaCampioneEmitter.emit(this.id);
    }
    this.modalRef.close();

  }

  annulla() {
    this.modalRef.close();
  }

}
