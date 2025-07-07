import { Usuario } from "./usuario.model";

export interface AuthResponse {
  status: number;
  message: string;
  data: {
    token: string;
    usuario: Usuario;
    roles?: any; // Opcional si no lo usas
  };
}