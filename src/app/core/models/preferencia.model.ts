export interface PreferenciaBaseRequest {
  idDocente: number;
  idAsignatura: number;
  idCicloAcademico: number; // CAMBIADO: idCargaElectiva → idCicloAcademico
}

export interface PreferenciaRequest extends PreferenciaBaseRequest {
  idDocente: number;
  idAsignatura: number;
  idCicloAcademico: number; // CAMBIADO
}

export interface PreferenciaMultipleRequest {
  preferencias: PreferenciaBaseRequest[];
}

export interface PreferenciaMultipleResponse {
  status: number;
  message: string;
  data: PreferenciaResponse[];
}

export interface PreferenciaResponse {
  idPreferencia: number;
  docente: {
    idDocente: number;
    codigo: string;
    usuario: {
      nombre: string;
      apellido: string;
    };
  };
  asignatura: {
    idAsignatura: number;
    nombre: string;
    codigo?: string; // Agregar esta propiedad opcional
  };
  cicloAcademico: {
    idCicloAcademico: number;
    nombre: string;
    enabled?: boolean;
  };
  enabled: boolean;
}
export interface PreferenciaListResponse {
  status: number;
  message: string;
  data: PreferenciaResponse[];
}

export interface CicloAcademicoListResponse {
  status: number;
  message: string;
  data: {
    idCicloAcademico: number;
    nombre: string;
    enabled: boolean;
  }[];
}

export interface AsignaturaListResponse {
  status: number;
  message: string;
  data: {
    idAsignatura: number;
    codigo: string;
    nombre: string;
    enabled: boolean;
  }[];
}
// Agrega esto a preferencia.model.ts

export interface PreferenciaDocenteResponse {
  idDocente: number;
  usuario: {
    nombre: string;
    apellido: string;
  };
  preferencias: PreferenciaSimple[];
  enabled: boolean;
}

export interface PreferenciaSimple {
  idPreferencia: number;
  asignatura: {
    idAsignatura: number;
    nombre: string;
  };
  enabled: boolean;
}

export interface PreferenciasPorDocenteResponse {
  status: number;
  message: string;
  data: PreferenciaDocenteResponse[];
}