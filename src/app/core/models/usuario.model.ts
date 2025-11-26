export interface Usuario {
  idUsuario: number;
  rol: {            
    idRol: number;
    nombre: string;
    enabled: boolean;
  };
  codigo: string;
  nombre: string;  
  apellido: string; 
  email: string;
  enabled: boolean; 
}