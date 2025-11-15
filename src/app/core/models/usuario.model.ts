// En tu modelo de usuario
export interface Usuario {
  idUsuario: number;
  rol: {              // ← Agregar esta interfaz
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