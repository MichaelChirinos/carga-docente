import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { from, Observable } from 'rxjs';
import { LogisticaRequest, LogisticaApiResponse } from '../../../core/models/logistica.model';
import { DirectorRequest, DirectorResponse } from '../../../core/models/director'; // Usando tus interfaces
import { EscuelaRequest, EscuelaResponse } from '../../../core/models/escuela';
import { PlanEstudioRequest, PlanEstudioResponse } from '../../../core/models/plan-estudio';
import { CicloAcademicoRequest, CicloAcademicoResponse } from '../../../core/models/ciclo-academico';
import { AsignaturaRequest, AsignaturaResponse } from '../../../core/models/asignatura';
import { CursoIndividualRequest, CursoRequest, CursoResponse } from '../../../core/models/curso';
import { JefeDepartamentoRequest, JefeDepartamentoApiResponse } from '../../../core/models/jefe-departamento.model';
import { Algoritmo,AlgoritmoRequest,AlgoritmoResponse, AlgoritmoListResponse } from '../../../core/models/algoritmo.model';
import { Categoria } from '../../../core/models/docente.model';
import { AsignacionRequest } from '../../../core/models/asignacion';
@Injectable({ providedIn: 'root' })
export class DirectorService {
  private apiUrl = `${environment.apiUrl}`; 

  constructor(private http: HttpClient) {}

  registrarDirector(directorData: DirectorRequest): Observable<DirectorResponse> {
    return this.http.post<DirectorResponse>(
      `${this.apiUrl}/director/insertar`, 
      directorData
    );
  }
    registrarLogistica(logisticaData: LogisticaRequest): Observable<LogisticaApiResponse> {
    return this.http.post<LogisticaApiResponse>(`${this.apiUrl}/logistica/insertar`, logisticaData);
  }
 obtenerLogisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logistica/listar`);
  }
registrarJefeDepartamento(jefeData: JefeDepartamentoRequest): Observable<JefeDepartamentoApiResponse> {
    return this.http.post<JefeDepartamentoApiResponse>(
      `${this.apiUrl}/jefe-departamento/insertar`,
      jefeData
    );
  }
  obtenerAsignaturaPorId(idAsignatura: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/asignatura/buscar/${idAsignatura}`);
}

eliminarAsignatura(idAsignatura: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/asignatura/eliminar/${idAsignatura}`);
}
obtenerJefesDepartamento(): Observable<any> {
  return this.http.get(`${this.apiUrl}/jefe-departamento/listar`);
}
obtenerJefeDepartamentoPorId(idJefe: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/jefe-departamento/buscar/${idJefe}`);
}

actualizarJefeDepartamento(idJefe: number, jefeData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/jefe-departamento/actualizar/${idJefe}`, jefeData);
}
obtenerLogisticaPorId(idLogistica: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/logistica/buscar/${idLogistica}`);
}

actualizarLogistica(idLogistica: number, logisticaData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/logistica/actualizar/${idLogistica}`, logisticaData);
}

eliminarLogistica(idLogistica: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/logistica/eliminar/${idLogistica}`);
}


obtenerAlgoritmoPorId(idAlgoritmo: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/algoritmo/buscar/${idAlgoritmo}`);
}

actualizarAlgoritmo(idAlgoritmo: number, algoritmoData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/algoritmo/actualizar/${idAlgoritmo}`, algoritmoData);
}

eliminarAlgoritmo(idAlgoritmo: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/algoritmo/eliminar/${idAlgoritmo}`);
}

eliminarJefeDepartamento(idJefe: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/jefe-departamento/eliminar/${idJefe}`);
}
    obtenerAlgoritmos(): Observable<AlgoritmoListResponse> {
    return this.http.get<AlgoritmoListResponse>(`${this.apiUrl}/algoritmo/listar`);
  }
  marcarAlgoritmoComoPrincipal(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/algoritmo/principal/${id}`, {});
}
// director.service.ts
obtenerPlanEstudioPorId(idPlan: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/plan-de-estudio/buscar/${idPlan}`);
}

actualizarPlanEstudio(idPlan: number, planData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/plan-de-estudio/actualizar/${idPlan}`, planData);
}

eliminarPlanEstudio(idPlan: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/plan-de-estudio/eliminar/${idPlan}`);
}

  registrarEscuela(escuelaData: EscuelaRequest): Observable<EscuelaResponse> {
    return this.http.post<EscuelaResponse>(
      `${this.apiUrl}/escuela/insertar`, 
      escuelaData
    );
  }
   registrarPlanEstudio(planData: PlanEstudioRequest): Observable<PlanEstudioResponse> {
    return this.http.post<PlanEstudioResponse>(
      `${this.apiUrl}/plan-de-estudio/insertar`, 
      planData
    );
  }
  registrarPlanesMultiples(planesData: PlanEstudioRequest[]): Observable<PlanEstudioResponse> {
  return this.http.post<PlanEstudioResponse>(
    `${this.apiUrl}/plan-de-estudio/insertar-all`, 
    planesData
  );
}
registrarEscuelasMultiples(escuelasData: EscuelaRequest[]): Observable<EscuelaResponse> {
  return this.http.post<EscuelaResponse>(
    `${this.apiUrl}/escuela/insertar-all`, 
    escuelasData
  );
}
  registrarCicloAcademico(cicloData: CicloAcademicoRequest): Observable<CicloAcademicoResponse> {
    return this.http.post<CicloAcademicoResponse>(
      `${this.apiUrl}/ciclo-academico/insertar`, 
      cicloData
    );
  }
   registrarAsignatura(asignaturaData: AsignaturaRequest): Observable<AsignaturaResponse> {
    return this.http.post<AsignaturaResponse>(
      `${this.apiUrl}/asignatura/insertar`, 
      asignaturaData
    );
  }
   registrarAsignaturas(asignaturasData: AsignaturaRequest[]): Observable<AsignaturaResponse> {
    return this.http.post<AsignaturaResponse>(
      `${this.apiUrl}/asignatura/insertar-all`, 
      asignaturasData
    );
  }

   obtenerAsignaturas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/asignatura/listar`);
  }
obtenerPlanesEstudio(): Observable<{status: number, message: string, data: any[]}> {
  return this.http.get<{status: number, message: string, data: any[]}>(
    `${this.apiUrl}/plan-de-estudio/listar`
  );
}
obtenerCicloAcademicoById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/ciclo-academico/buscar/${id}`);
}

actualizarCicloAcademico(id: number, data: CicloAcademicoRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/ciclo-academico/actualizar/${id}`, data);
}
obtenerAsignaturaById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/asignatura/buscar/${id}`);
}
  obtenerEscuelaPorId(idEscuela: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/escuela/buscar/${idEscuela}`);
  }

actualizarAsignatura(id: number, data: AsignaturaRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/asignatura/actualizar/${id}`, data);
}
  getCategoriaById(id: number): Observable<Categoria> {
  return this.http.get<Categoria>(`${this.apiUrl}/categoria/buscar/${id}`);
}

actualizarCategoria(id: number, categoriaData: Partial<Categoria>): Observable<Categoria> {
  return this.http.put<Categoria>(`${this.apiUrl}/categoria/actualizar/${id}`, categoriaData);
}
obtenerCursos(): Observable<any> {
  return this.http.get(`${this.apiUrl}/curso/listar`);
}
registrarCurso(curso: CursoIndividualRequest): Observable<any> {
  return this.http.post(`${this.apiUrl}/curso/insertar`, curso);
}
obtenerCursosPorCiclo(idCiclo: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/curso/listar/${idCiclo}`);
}

  obtenerEscuelas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/escuela/listar`);
  }
// En director.service.ts
obtenerCursoPorId(idCurso: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/curso/buscar/${idCurso}`);
}

actualizarCurso(idCurso: number, datos: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/curso/actualizar/${idCurso}`, datos);
}

eliminarCurso(idCurso: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/curso/eliminar/${idCurso}`);
}
  obtenerCiclosAcademicos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ciclo-academico/listar`);
  }
  listarDirectores(): Observable<{status: number, message: string, data: DirectorResponse[]}> {
    return this.http.get<{status: number, message: string, data: DirectorResponse[]}>(`${this.apiUrl}/director/listar`);
  }

  obtenerDirectorPorId(id: number): Observable<DirectorResponse> {
    return this.http.get<DirectorResponse>(`${this.apiUrl}/director/buscar/${id}`);
  }
  // director.service.ts
obtenerCicloAcademicoPorId(idCiclo: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/ciclo-academico/buscar/${idCiclo}`);
}

eliminarCicloAcademico(idCiclo: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/ciclo-academico/eliminar/${idCiclo}`);
}
obtenerCursoById(idCurso: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/curso/buscar/${idCurso}`);
}

insertarHorarioCurso(idCurso: number, horarioData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/curso/${idCurso}/horario/insertar`, horarioData);
}

// Insertar múltiples horarios a un curso existente  
insertarHorariosCurso(idCurso: number, horariosData: any[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/curso/${idCurso}/horario/insertar-all`, horariosData);
}

// Obtener horarios de un curso específico
obtenerHorariosCurso(idCurso: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/curso/buscar/${idCurso}`);
}
actualizarHorarioCurso(idCursoHorario: number, datosHorario: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/curso/horario/actualizar/${idCursoHorario}`, datosHorario);
}
// Nuevos endpoints para horarios
agregarHorarioCurso(idCurso: number, horarioData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/curso/${idCurso}/horario/insertar`, horarioData);
}

agregarHorariosCurso(idCurso: number, horariosData: any[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/curso/${idCurso}/horario/insertar-all`, horariosData);
}

eliminarHorarioCurso(idCursoHorario: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/curso/horario/eliminar/${idCursoHorario}`);
}
obtenerEscuelaById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/escuela/buscar/${id}`);
}
eliminarDirector(idDirector: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/director/eliminar/${idDirector}`);
}

actualizarEscuela(idEscuela: number, escuelaData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/escuela/actualizar/${idEscuela}`, escuelaData);
}
eliminarEscuela(idEscuela: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/escuela/eliminar/${idEscuela}`);
}
actualizarDirector(idDirector: number, directorData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/director/actualizar/${idDirector}`, directorData);
}
insertarAlgoritmo(algoritmo: AlgoritmoRequest): Observable<AlgoritmoResponse> {
    return this.http.post<AlgoritmoResponse>(`${this.apiUrl}/algoritmo/insertar`, algoritmo);
  }
  // En director.service.ts - Agrega estos métodos

registrarCursosMultiples(cursosData: CursoRequest[]): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/curso/insertar-all`, 
    cursosData
  );
}
  // Obtener asignación por ID
  obtenerAsignacionPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/asignacion/buscar/${id}`);
  }

  // Actualizar asignación
  actualizarAsignacion(id: number, asignacion: AsignacionRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/asignacion/actualizar/${id}`, asignacion);
  }

  // Eliminar asignación
  eliminarAsignacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/asignacion/eliminar/${id}`);
  }
// Obtener docentes
obtenerDocentes(): Observable<any> {
  return this.http.get(`${this.apiUrl}/docente/listar`);
}

// Obtener cargas académicas
obtenerCargasAcademicas(): Observable<any> {
  return this.http.get(`${this.apiUrl}/carga/listar`);
}

// Crear asignación
crearAsignacion(asignacionData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/asignacion/insertar`, asignacionData);
}

// Obtener asignaciones
obtenerAsignaciones(): Observable<any> {
  return this.http.get(`${this.apiUrl}/asignacion/listar`);
}
// Obtener aulas disponibles
obtenerAulas(): Observable<any> {
  return this.http.get(`${this.apiUrl}/aula/listar`);
}
  obtenerAsignacionesPorDocenteYCarga(idDocente: number, idCarga: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/asignacion/listar/${idDocente}/${idCarga}`);
  }

}