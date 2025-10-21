import {Routes} from '@angular/router';
import {MainComponent} from './components/main-component/main-component';
import {BookListComponent} from './components/book-list-component/book-list-component';

export const bookRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: BookListComponent
      },
      {
        path: 'my-books',
        component: MainComponent
      }
    ]
  }
];
