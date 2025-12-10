// listar-cursos-escuela-agrupado.component.ts
import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-cursos-escuela-agrupado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listar-asignaciones-escuelas.component.html'
})
export class ListarCursosEscuelaAgrupadoComponent implements OnInit {
  // Variables para filtros
  ciclosAcademicos: any[] = [];
  escuelas: any[] = [];
  cargasAcademicas: any[] = [];
  idCicloAcademicoSeleccionado: number = 0;
  idEscuelaSeleccionada: number = 0;
  idCargaSeleccionada: number = 0;
  
  // Variables para resultados
  cursosAgrupados: any[] = [];
  
  // Estados de carga
  loading = false;
  loadingCiclos = false;
  loadingEscuelas = false;
  loadingCargas = false;
  
  // Estados UI
  message = '';
  isError = false;
  
  // Estados para expandir asignaturas individualmente
  asignaturasExpandidas: Set<number> = new Set();

  constructor(private directorService: DirectorService) {}

  ngOnInit(): void {
    this.cargarCiclosAcademicos();
    this.cargarEscuelas();
  }

  // ========== MÉTODOS DE CARGA ==========
  cargarCiclosAcademicos(): void {
    this.loadingCiclos = true;
    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        const ciclos = response.data || response || [];
        this.ciclosAcademicos = ciclos;
        
        // Seleccionar ciclo activo por defecto
        const cicloActivo = ciclos.find((ciclo: any) => ciclo.enabled);
        if (cicloActivo) {
          this.idCicloAcademicoSeleccionado = cicloActivo.idCicloAcademico;
          this.cargarCargasAcademicas();
        } else if (ciclos.length > 0) {
          this.idCicloAcademicoSeleccionado = ciclos[0].idCicloAcademico;
          this.cargarCargasAcademicas();
        }
        
        this.loadingCiclos = false;
      },
      error: (err) => {
        console.error('Error cargando ciclos académicos:', err);
        this.showMessage('Error al cargar ciclos académicos', true);
        this.loadingCiclos = false;
      }
    });
  }

  cargarEscuelas(): void {
    this.loadingEscuelas = true;
    this.directorService.obtenerEscuelas().subscribe({
      next: (response: any) => {
        this.escuelas = response.data || response || [];
        if (this.escuelas.length > 0) {
          this.idEscuelaSeleccionada = this.escuelas[0].idEscuela;
        }
        this.loadingEscuelas = false;
      },
      error: (err) => {
        console.error('Error cargando escuelas:', err);
        this.showMessage('Error al cargar escuelas', true);
        this.loadingEscuelas = false;
      }
    });
  }

  cargarCargasAcademicas(): void {
    if (!this.idCicloAcademicoSeleccionado) {
      this.cargasAcademicas = [];
      return;
    }

    this.loadingCargas = true;
    this.cargasAcademicas = [];
    this.idCargaSeleccionada = 0;

    this.directorService.obtenerCargasAcademicasPorCiclo(this.idCicloAcademicoSeleccionado).subscribe({
      next: (response: any) => {
        this.cargasAcademicas = response.data || response || [];
        if (this.cargasAcademicas.length > 0) {
          this.idCargaSeleccionada = this.cargasAcademicas[0].idCarga;
        }
        this.loadingCargas = false;
      },
      error: (err) => {
        console.error('Error cargando cargas académicas:', err);
        this.showMessage('Error al cargar cargas académicas', true);
        this.loadingCargas = false;
      }
    });
  }

  buscarCursosAgrupadosPorEscuela(): void {
    if (!this.idCicloAcademicoSeleccionado || !this.idCargaSeleccionada || !this.idEscuelaSeleccionada) {
      this.showMessage('Por favor seleccione un ciclo académico, una carga académica y una escuela', true);
      return;
    }

    this.loading = true;
    this.cursosAgrupados = [];
    this.asignaturasExpandidas.clear();

    // Llamar al nuevo endpoint con los tres parámetros
    this.directorService.obtenerCursosAgrupadosPorCargaYEscuela(
      this.idCicloAcademicoSeleccionado,
      this.idCargaSeleccionada,
      this.idEscuelaSeleccionada
    ).subscribe({
      next: (response: any) => {
        // Acceder correctamente a la estructura de datos
        if (response.data && Array.isArray(response.data)) {
          this.cursosAgrupados = response.data;
        } else if (response && Array.isArray(response)) {
          this.cursosAgrupados = response;
        } else {
          this.cursosAgrupados = [];
        }
        
        this.loading = false;
        
        if (this.cursosAgrupados.length === 0) {
          this.showMessage('No se encontraron cursos para los criterios seleccionados', false);
        } else {
        
        }
      },
      error: (err) => {
        console.error('Error cargando cursos agrupados por escuela:', err);
        this.cursosAgrupados = [];
        this.loading = false;
        this.showMessage('Error al cargar los cursos agrupados', true);
      }
    });
  }

  // ========== MÉTODOS PARA CURSOS AGRUPADOS ==========
  toggleAsignatura(index: number): void {
    if (this.asignaturasExpandidas.has(index)) {
      this.asignaturasExpandidas.delete(index);
    } else {
      this.asignaturasExpandidas.add(index);
    }
  }

  isAsignaturaExpandida(index: number): boolean {
    return this.asignaturasExpandidas.has(index);
  }

  getTotalAsignaturas(): number {
    if (this.cursosAgrupados.length === 0) return 0;
    
    let total = 0;
    this.cursosAgrupados.forEach((grupo: any) => {
      total += grupo.asignaturas?.length || 0;
    });
    return total;
  }

  getTotalCursos(): number {
    if (this.cursosAgrupados.length === 0) return 0;
    
    let total = 0;
    this.cursosAgrupados.forEach((grupo: any) => {
      if (grupo.asignaturas) {
        grupo.asignaturas.forEach((asignatura: any) => {
          total += asignatura.cursos?.length || 0;
        });
      }
    });
    return total;
  }

  // Obtener todas las asignaturas de todos los grupos
  getTodasAsignaturas(): any[] {
    if (this.cursosAgrupados.length === 0) return [];
    
    const todasAsignaturas: any[] = [];
    this.cursosAgrupados.forEach((grupo: any) => {
      if (grupo.asignaturas && Array.isArray(grupo.asignaturas)) {
        // Agregar el ciclo a cada asignatura para referencia
        grupo.asignaturas.forEach((asignatura: any) => {
          todasAsignaturas.push({
            ...asignatura,
            ciclo: grupo.ciclo || 'N/A'
          });
        });
      }
    });
    return todasAsignaturas;
  }

  // Método para calcular la duración de un curso
  calcularDuracionHoras(curso: any): number {
    if (!curso.horarios || curso.horarios.length === 0) return 0;
    
    let total = 0;
    curso.horarios.forEach((horario: any) => {
      if (horario.horaInicio && horario.horaFin) {
        const inicio = new Date(`2000-01-01T${horario.horaInicio}`);
        const fin = new Date(`2000-01-01T${horario.horaFin}`);
        const diferenciaMs = fin.getTime() - inicio.getTime();
        total += diferenciaMs / (1000 * 60 * 60);
      }
    });
    
    return Math.round(total * 100) / 100;
  }

  // Método para formatear un horario
  formatearHorario(horario: any): string {
    if (!horario) return '';
    
    const dia = this.capitalizeFirstLetter(horario.dia || '');
    const inicio = horario.horaInicio?.substring(0, 5) || '';
    const fin = horario.horaFin?.substring(0, 5) || '';
    const tipo = horario.tipoSesion || '';
    
    if (dia && inicio && fin) {
      return `${dia} ${inicio}-${fin}${tipo ? ` (${tipo})` : ''}`;
    }
    return dia || 'Horario';
  }

  // ========== MÉTODOS DE UTILIDAD ==========
  getCicloSeleccionado(): string {
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === this.idCicloAcademicoSeleccionado);
    return ciclo ? `${ciclo.nombre}` : '';
  }

  getCargaSeleccionada(): string {
    const carga = this.cargasAcademicas.find(c => c.idCarga === this.idCargaSeleccionada);
    return carga ? carga.nombre : '';
  }

  getEscuelaSeleccionada(): string {
    const escuela = this.escuelas.find(e => e.idEscuela === this.idEscuelaSeleccionada);
    return escuela ? escuela.nombre : '';
  }

  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // ========== MÉTODOS DE UI ==========
  onCicloChange(): void {
    this.cargarCargasAcademicas();
    this.cursosAgrupados = [];
    this.asignaturasExpandidas.clear();
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}