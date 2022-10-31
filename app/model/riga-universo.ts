import {Universo} from './universo';

export interface RigaUniverso {

  id: number;
  universo: Universo;
  tipoAffidamento: string;
  idProgetto: number;
  progettoDataFine: string;
  progettoTitolo: string;
  idMovimento: number;
  idGiustificativo: number;
  categoria;
  macrovoce;
  voce;
  sottovoce;
  importoFinanziato: number;
  importoValEnte: number;
  importoGiustificativo: number;
  importoValOi: number;
  fontiFinanziarie;
  asse;
  estremi;
  dataGiustificativo;
  oggetto;
  costoBase;
  piva: string;
  denominazioneEnte: string;
  sedeSvolgimento;
  classeSede;
  codiceRischio: string;
  flgCampionato: number;
  dataEstrazione: string;
  probabilita;
  dimensioneIntervento: string;
  tipoGiustificativo: string;
  utr: string;
  provinciaSede: string;
  userCreate: string;
  userModify: string;
  tmstCreate: Date;
  tmstModify: Date;
  statovalidazioneoi: number;

}
