import {TipoUniverso} from '../model/universo';

export class Costanti {
  static codiceAvvisoGiustificativi = '1';
  static codiceAvvisoInloco = '2';
  static codiceTirocini = '3';
  static codiceServizioCivile = '4';
  static codiceServiziInfanzia = '5';

  static codiceCampioneAperto = 'AP';
  static codiceCampioneChiuso = 'CH';


  static getTipologieUniverso() {
    const tipologie = new Array<TipoUniverso>();

    tipologie.push({code: this.codiceAvvisoGiustificativi, label: this.decodificaTipoUniverso(this.codiceAvvisoGiustificativi)});
    tipologie.push({code: this.codiceAvvisoInloco, label: this.decodificaTipoUniverso(this.codiceAvvisoInloco)});
    tipologie.push({code: this.codiceTirocini, label: this.decodificaTipoUniverso(this.codiceTirocini)});
    tipologie.push({code: this.codiceServizioCivile, label: this.decodificaTipoUniverso(this.codiceServizioCivile)});
    tipologie.push({code: this.codiceServiziInfanzia, label: this.decodificaTipoUniverso(this.codiceServiziInfanzia)});

    return tipologie;
  }


  static getTipologieUniversoLoco() {
    const tipologie = new Array<{ code: string, label: string }>();
    tipologie.push({code: this.codiceAvvisoInloco, label: this.decodificaTipoUniverso(this.codiceAvvisoInloco)});
    tipologie.push({code: this.codiceServizioCivile, label: this.decodificaTipoUniverso(this.codiceServizioCivile)});
    return tipologie;
  }

  static decodificaTipoUniverso(code) {
    if (code === this.codiceAvvisoGiustificativi) {
      return 'Avviso concessorio (giustificativi)';
    } else if (code === this.codiceAvvisoInloco) {
      return 'Avviso concessorio (in loco)';
    } else if (code === this.codiceTirocini) {
      return 'Tirocini';
    } else if (code === this.codiceServizioCivile) {
      return 'Servizio civile';
    } else if (code === this.codiceServiziInfanzia) {
      return 'Loco UCS Infanzia';
    }

  }

  static decodificaStato(code) {
    if (code === this.codiceCampioneAperto) {
      return 'APERTO';
    } else if (code === this.codiceCampioneChiuso) {
      return 'CHIUSO';
    }

  }

  static getStatiCampione(): { code: string, label: string }[] {
    const stati = new Array<{ code: string, label: string }>();
    stati.push({code: this.codiceCampioneAperto, label: this.decodificaStato(this.codiceCampioneAperto)});
    stati.push({code: this.codiceCampioneChiuso, label: this.decodificaStato(this.codiceCampioneChiuso)});
    return stati;
  }

}
