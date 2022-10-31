import { Universo } from "./universo";

export class Campione{

    id: number;
	
    dataEstrazione;
	
	 dataDal;
	
	dataAl;
	
	stato: string;
	
	totRigheCampione: number;
	
	totRigheSottosoglia: number;
	
	totRigheSoprasoglia: number;
	
	 totImpFinanziato: number;
	
	totImpValente: number;
	
	totImpGiustificativo: number;
	
	totImpValOi: number;
	
    randomSeed: number;
    
	righeCampione = new Array<any>();
	
	universo= new Universo();

	totSenzaEsito;
	
	totEsitoOk;
	
	totEsitoKo;

	totEsitoPr;

	totRigheNegativo;
	
	righeClasse1: number = 0;
	righeClasse2: number = 0;
	righeClasse3: number = 0;

}