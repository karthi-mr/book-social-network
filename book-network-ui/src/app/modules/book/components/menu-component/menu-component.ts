import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-menu-component',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.scss'
})
export class MenuComponent {

  protected onLogout(): void {
    localStorage.removeItem('token');
    window.location.reload();
  }
}
