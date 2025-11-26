export interface CicloAcademicoRequest {
  anio: number;
  periodo: number;
  fechaInicio: string; 
  fechaFin: string;    
}

export interface CicloAcademicoResponse {
  status: number;
  message: string;
  data: {
    idCicloAcademico: number;
    anio: number;
    periodo: number;
    nombre: string;
    fechaInicio: string;
    fechaFin: string;    
    enabled: boolean;
  };
}