import {Routes} from '@angular/router';
import {MainComponent} from './components/main-component/main-component';
import {BookListComponent} from './components/book-list-component/book-list-component';
import {MyBooks} from './components/my-books/my-books';
import {ManageBook} from './components/manage-book/manage-book';
import {BorrowedBookList} from './components/borrowed-book-list/borrowed-book-list';
import {ReturnBooks} from './components/return-books/return-books';

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
      },
      {
        path: 'my-borrowed-books',
        component: BorrowedBookList
      },
      {
        path: 'my-returned-books',
        component: ReturnBooks
      }
    ]
  }
];
