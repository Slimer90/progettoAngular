export class Universo {
  id;
  dataEstrazione;
  dataDal;
  dataAl;
  tipoUniverso;
  totaleRigheEstratte: number;
  totImportoFinanziato: number;
  totImpoValEnte: number;
  totImpoGiustificativo;
  totImpoValOi: number;
  codOI: string;
  contatoreClasse1: number;
  contatoreClasse2: number;
  contatoreClasse3: number;
}

export interface TipoUniverso {
  code: string;
  label: string;
}
