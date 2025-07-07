// admin/listar-directores/listar-directores.component.ts
import { Component } from '@angular/core';
import { DirectorService } from '../services/director.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-directores',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-directores.component.html'
})
export class ListarDirectoresComponent {
  directores: any[] = [];
  loading = true;
errorMessage: any;

  constructor(
    private directorService: DirectorService,
    private router: Router,
    private route: ActivatedRoute  

  ) {}

  ngOnInit(): void {
    this.cargarDirectores();
  }
editarDirector(id: number): void {
  this.router.navigate(['/admin/editar-director', id]);
}
  cargarDirectores(): void {
    this.directorService.listarDirectores().subscribe({
      next: (res) => {
        this.directores = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar directores', err);
        this.loading = false;
      }
    });
  }


}