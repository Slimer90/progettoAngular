import {Parametro} from './parametro';

export class CriterioCampionamento {
  id: number;
  selected: boolean;
  valoreSoglia: string;
  operatore: string;
  parametro: Parametro;


  constructor() {
    this.id = null;
    this.selected = false;
    this.valoreSoglia = '';
    this.operatore = '';
    this.parametro = new Parametro();

  }
}
