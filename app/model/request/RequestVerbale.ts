export class RequestVerbale {

  private idCampione: number;
  private user: string;
  private notaVerbale: string;

  constructor() {
  }


  get _idCampione(): number {
    return this.idCampione;
  }

  set _idCampione(value: number) {
    this.idCampione = value;
  }

  get _user(): string {
    return this.user;
  }

  set _user(value: string) {
    this.user = value;
  }

  get _notaVerbale(): string {
    return this.notaVerbale;
  }

  set _notaVerbale(value: string) {
    this.notaVerbale = value;
  }
  
}
