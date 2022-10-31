import { Component } from '@angular/core';
import {CampionamentoService} from '../services/services';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-note-verbale',
  templateUrl: './note-verbale.component.html',
  styleUrls: ['./note-verbale.component.css']
})
export class NoteVerbaleComponent {

  message: string;
  modalRef: NgbModalRef;
  notaVerbale: string;

  constructor(private service: CampionamentoService) { }


  getNoteVerbale(event) {
    const target = event.target as HTMLTextAreaElement;
    this.notaVerbale = target.value;
  }

  conferma() {
    this.service.noteVerbale.emit(this.notaVerbale);
    this.modalRef.close();
  }

  annulla() {
    this.modalRef.close();
  }
}
