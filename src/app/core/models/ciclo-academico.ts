export interface CicloAcademicoRequest {
  anio: number;
  periodo: number;
  fechaInicio: string; // Formato: "DD-MM-YYYY"
  fechaFin: string;    // Formato: "DD-MM-YYYY"
}

export interface CicloAcademicoResponse {
  status: number;
  message: string;
  data: {
    idCicloAcademico: number;
    anio: number;
    periodo: number;
    nombre: string;
    fechaInicio: string; // Formato: "YYYY-MM-DD"
    fechaFin: string;    // Formato: "YYYY-MM-DD"
    enabled: boolean;
  };
}