import {Routes} from '@angular/router';
import {MainComponent} from './components/main-component/main-component';
import {BookListComponent} from './components/book-list-component/book-list-component';
import {MyBooks} from './components/my-books/my-books';
import {ManageBook} from './components/manage-book/manage-book';

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
        component: MyBooks
      },
      {
        path: 'manage',
        component: ManageBook
      },
      {
        path: 'manage/:bookId',
        component: ManageBook
      }
    ]
  }
];
