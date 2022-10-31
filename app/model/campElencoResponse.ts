export interface CampElencoCodaResponse {

  id: number;

  stato: StatoCodaEnum;
}


export enum StatoCodaEnum {

  RICEVUTO = 'RICEVUTO',
  AVVIATO = 'AVVIATO',
  ERRORE = 'ERRORE',
  CONCLUSO = 'CONCLUSO'
}
