export interface Algoritmo {
  idAlgoritmo: number;
  principal: boolean;
  poblacion: number;
  generacionGa: number;
  probCruzamientos: number;
  probMutacion: number;
  elitismo: number;
  enjambrePso: number;
  iteracionesPso: number;
  inerciaInicial: number;
  inerciaFinal: number;
  cUno: number;
  cDos: number;
  velocidadMaxima: number;
  cicloHibridos: number;
  createdAt: string;
  enabled?: boolean;
}

export interface AlgoritmoRequest {
  poblacion: number;
  generacionGa: number;
  probCruzamientos: number;
  probMutacion: number;
  elitismo: number;
  enjambrePso: number;
  iteracionesPso: number;
  inerciaInicial: number;
  inerciaFinal: number;
  cUno: number;
  cDos: number;
  velocidadMaxima: number;
  cicloHibridos: number;
}

export interface AlgoritmoResponse {
  status: number;
  message: string;
  data: Algoritmo;
}
export interface AlgoritmoListResponse {
  status: number;
  message: string;
  data: Algoritmo[];
}