import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {fakeAsync} from '@angular/core/testing';

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

  }
}
