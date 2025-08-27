import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styles: [`
    .navbar {
      margin-bottom: 20px;
    }
  `]
})
export class AppComponent {
  title = 'BTG Fondos App';
}
