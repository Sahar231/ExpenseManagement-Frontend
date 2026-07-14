import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    /* Tu peux ajouter des styles globaux pour ton composant racine ici si besoin */
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
  `]
})
export class App {
  title = 'FraisMissionFront';
}