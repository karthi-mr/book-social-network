import {Component, OnInit} from '@angular/core';
import {BookCard} from '../book-card/book-card';
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {ApiConfiguration} from '../../../../services/api-configuration';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {findAllBooksByOwner} from '../../../../services/functions';
import {Router, RouterLink} from '@angular/router';
import {BookResponse} from '../../../../services/models/book-response';

@Component({
  selector: 'app-my-books',
  imports: [
    BookCard,
    RouterLink
  ],
  templateUrl: './my-books.html',
  styleUrl: './my-books.scss'
})
export class MyBooks implements OnInit{
  protected page: number = 0;
  protected size: number = 10;
  protected bookResponse: PageResponseBookResponse | undefined | null;

  constructor(
    private apiConfig: ApiConfiguration,
    private http: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks(): void {
    findAllBooksByOwner(
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

  protected archiveBook(book: BookResponse): void {

  }

  protected shareBook(book: BookResponse): void {

  }

  protected editBook(book: BookResponse): void {
    this.router.navigate(['books', 'manage', book.id]).then();
  }
}
