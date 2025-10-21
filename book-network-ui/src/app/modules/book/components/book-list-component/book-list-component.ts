import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiConfiguration} from '../../../../services/api-configuration';
import {borrowBook, findAllBooks} from '../../../../services/functions';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {BookCard} from '../book-card/book-card';
import {BookResponse} from '../../../../services/models/book-response';

export enum MessageLevel {
  SUCCESS,
  ERROR
}

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
  protected message: string = '';
  protected level: MessageLevel = MessageLevel.SUCCESS;

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

  protected get isLastPage(): boolean {
    return this.page === this.bookResponse?.totalPages as number - 1;
  }

  protected onClickGoToFirstPage(): void {
    this.page = 0;
    this.findAllBooks();
  }

  protected onClickGoToPreviousPage(): void {
    this.page--;
    this.findAllBooks();
  }

  protected onClickGoToPage(index: number): void {
    this.page = index;
    this.findAllBooks();
  }

  protected onClickGoToNextPage(): void {
    this.page++;
    this.findAllBooks();
  }

  protected onClickGoToLastPage(): void {
    this.page = this.bookResponse?.totalPages as number - 1;
    this.findAllBooks();
  }

  protected borrowBook(book: BookResponse) {
    this.message = '';
    borrowBook(
      this.http,
      this.apiConfig.rootUrl,
      {
        'book-id': book.id as number
      }
    ).subscribe({
      next: (res: HttpResponse<number>) => {
        console.log('Result:', res);
        this.level = MessageLevel.SUCCESS;
        this.message = 'Book successfully added to your list';
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error:', err);
        this.message = err.error.error
        this.level = MessageLevel.ERROR;
      }
    });
  }

  protected readonly MessageLevel = MessageLevel;
}
