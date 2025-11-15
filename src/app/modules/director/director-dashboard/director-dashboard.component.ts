import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-director-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './director-dashboard.component.html'
})
export class DirectorDashboardComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([`/director/${route}`]);
  }
}