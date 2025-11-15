// core/models/departamento-academico.model.ts
export interface DepartamentoAcademicoRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  idEscuela: number;
}

export interface DepartamentoAcademicoResponse {
  status: number;
  message: string;
  data: {
    idDepartamentoAcademico: number;
    usuario: {
      idUsuario: number;
      rol: {
        idRol: number;
        nombre: string;
        enabled: boolean;
      };
      email: string;
      enabled: boolean;
      codigo: string;
      nombre: string;
      apellido: string;
    };
    enabled: boolean;
  };
}

export interface DepartamentoAcademicoListResponse {
  status: number;
  message: string;
  data: DepartamentoAcademicoResponse['data'][];
}