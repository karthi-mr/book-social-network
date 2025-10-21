import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiConfiguration} from '../../../../services/api-configuration';
import {findAllBooks} from '../../../../services/functions';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {BookCard} from '../book-card/book-card';

@Component({
  selector: 'app-book-list-component',
  imports: [
    BookCard
  ],
  templateUrl: './book-list-component.html',
  styleUrl: './book-list-component.scss'
})
export class BookListComponent implements OnInit {
  protected page: number = 0;
  protected size: number = 10;
  protected bookResponse: PageResponseBookResponse | undefined | null;

  constructor(
    private router: Router,
    private apiConfig: ApiConfiguration,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks(): void {
    findAllBooks(
      this.http,
      this.apiConfig.rootUrl,
      {
        page: this.page,
        size: this.size
      }
    ).subscribe({
      next: (result: HttpResponse<PageResponseBookResponse>) => {
        console.log(result);
        this.bookResponse = result.body;
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error:', err);
      }
    });
  }
}
