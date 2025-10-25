import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuComponent} from '../menu-component/menu-component';

@Component({
  selector: 'app-main-component',
  imports: [
    RouterOutlet,
    MenuComponent
  ],
  templateUrl: './main-component.html',
  styleUrl: './main-component.scss'
})
export class MainComponent {

}
