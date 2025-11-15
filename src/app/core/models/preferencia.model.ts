
export interface PreferenciaBaseRequest {
  idDocente: number;
  idAsignatura: number;
  idCicloAcademico: number;
  idEscuela: number; 
}

export interface PreferenciaRequest extends PreferenciaBaseRequest {
}

export interface PreferenciaMultipleRequest {
  preferencias: PreferenciaBaseRequest[];
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
    codigo?: string;
  };
  cicloAcademico: {
    idCicloAcademico: number;
    nombre: string;
    enabled?: boolean;
  };
  escuela: { 
    idEscuela: number;
    nombre: string;
  };
  enabled: boolean;
}

export interface PreferenciaListResponse {
  status: number;
  message: string;
  data: PreferenciaResponse[];
}

export interface PreferenciaMultipleResponse {
  status: number;
  message: string;
  data: PreferenciaResponse[];
}

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
    idEscuela: number; 
  }[];
}

export interface EscuelaListResponse {
  status: number;
  message: string;
  data: {
    idEscuela: number;
    nombre: string;
    enabled: boolean;
  }[];
}

export interface AsignaturaSelect {
  idAsignatura: number;
  codigo: string;
  nombre: string;
  enabled: boolean;
  idEscuela: number;
}

export interface EscuelaSelect {
  idEscuela: number;
  nombre: string;
  enabled: boolean;
}

export interface PreferenciaFormData {
  idDocente: number;
  idAsignatura: number;
  idCicloAcademico: number;
  idEscuela: number;
}

export interface PreferenciaErrorResponse {
  status: number;
  message: string;
  error?: string;
}