import { Routes } from '@angular/router';
import {Login} from './components/login/login';
import {Register} from './components/register/register';
import {ActivateAccount} from './components/activate-account/activate-account';
import {authGuard} from './services/guard/auth-guard';

export const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: '/books'
  },
  {
    path: 'login', component: Login
  },
  {
    path: 'register', component: Register
  },
  {
    path: 'activate-account', component: ActivateAccount
  },
  {
    path: 'books',
    loadChildren: () => import('./modules/book/book.route').then(m => m.bookRoutes),
    canActivate: [authGuard]
  }
];
