import { AsignaturaResponse } from './asignatura'; // Importamos la interfaz existente
export interface PreferenciaBaseRequest {
  idDocente: number;
  idAsignatura: number;
  idCargaElectiva: number;
}
export interface PreferenciaRequest extends PreferenciaBaseRequest {
  idDocente: number;
  idAsignatura: number;
  idCargaElectiva: number;
}
export interface PreferenciaMultipleRequest {
  preferencias: PreferenciaBaseRequest[];
}
export interface PreferenciaMultipleResponse {
  status: number;
  message: string;
  data: PreferenciaResponse[];
}
export interface CargaElectiva {
  idCargaElectiva: number;
  nombre: string;
  cicloAcademico: {
    idCicloAcademico: number;
    nombre: string;
  };
  enabled: boolean;
}

export interface CargaElectivaListResponse {
  status: number;
  message: string;
  data: CargaElectiva[];
}

export interface PreferenciaResponse {
  idPreferencia: number;
  docente: {
    idDocente: number;
    usuario: {
      nombre: string;
      apellido: string;
    };
  };
  asignatura: {
    idAsignatura: number;
    nombre: string;
  };
  cargaElectiva: {
    idCargaElectiva: number;
    nombre: string;
  };
  enabled: boolean;
}
export interface PreferenciaListResponse {
  status: number;
  message: string;
  data: Preferencia[];
}
export interface Preferencia {
  idPreferencia: number;
  asignatura: {
    idAsignatura: number;
    nombre: string;
  };
  enabled: boolean;
}
export interface SinglePreferenciaResponse {
  status: number;
  message: string;
  data: {
    docente: {
      idDocente: number;
      usuario: {
        nombre: string;
        apellido: string;
      };
    };
    asignatura: {
      idAsignatura: number;
      nombre: string;
    };
    cargaElectiva: {
      idCargaElectiva: number;
      nombre: string;
    };
    enabled: boolean;
  };
}
export interface AsignaturaListResponse {
  data: {
    enabled: undefined;
    idAsignatura: number;
    nombre: string;
    codigo: string;
  }[];
}
