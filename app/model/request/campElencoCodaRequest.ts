import {TipoElencoEnum} from '../enums/tipoElencoEnum';

export interface CampElencoCodaRequest {

  tipoElenco: TipoElencoEnum;
  idElenco: number;
  pIvaEnte: string | null;

}
