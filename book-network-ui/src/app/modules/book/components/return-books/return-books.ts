import {Component, OnInit} from '@angular/core';
import {PageResponseBorrowedBookResponse} from '../../../../services/models/page-response-borrowed-book-response';
import {BorrowedBookResponse} from '../../../../services/models/borrowed-book-response';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ApiConfiguration} from '../../../../services/api-configuration';
import {approveReturnBorrowedBook, findAllReturnedBooks} from '../../../../services/functions';
import {MessageLevel} from '../../../../utils/message-level';

@Component({
  selector: 'app-return-books',
  imports: [],
  templateUrl: './return-books.html',
  styleUrl: './return-books.scss'
})
export class ReturnBooks implements OnInit {
  protected returnedBooks: PageResponseBorrowedBookResponse = {content: []};
  protected page: number = 0;
  protected size: number = 5;
  protected message: string = '';
  protected level: MessageLevel = MessageLevel.SUCCESS;

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {
  }

  ngOnInit(): void {
    this.onFindAllReturnedBooks();
  }

  private onFindAllReturnedBooks() {
    findAllReturnedBooks(
      this.http,
      this.apiConfig.rootUrl,
      {
        page: this.page,
        size: this.size
      }
    ).subscribe({
      next: (response: HttpResponse<PageResponseBorrowedBookResponse>) => {
        this.returnedBooks = response.body!;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error:', err);
      }
    });
  }


  // pagination
  protected get isLastPage(): boolean {
    return this.page === this.returnedBooks?.totalPages as number - 1;
  }

  protected onClickGoToFirstPage(): void {
    this.page = 0;
    this.onFindAllReturnedBooks();
  }

  protected onClickGoToPreviousPage(): void {
    this.page--;
    this.onFindAllReturnedBooks();
  }

  protected onClickGoToPage(index: number): void {
    this.page = index;
    this.onFindAllReturnedBooks();
  }

  protected onClickGoToNextPage(): void {
    this.page++;
    this.onFindAllReturnedBooks();
  }

  protected onClickGoToLastPage(): void {
    this.page = this.returnedBooks?.totalPages as number - 1;
    this.onFindAllReturnedBooks();
  }

  onApproveBookReturn(book: BorrowedBookResponse): void {
    if (!book.returned) {
      this.message = 'Book is not returned yet!';
      this.level = MessageLevel.ERROR;
      return;
    }
    approveReturnBorrowedBook(
      this.http,
      this.apiConfig.rootUrl,
      {
        'book-id': book.id!
      }
    ).subscribe({
      next: () => {
        this.message = 'Book return approved!';
        this.level = MessageLevel.SUCCESS;
        this.onFindAllReturnedBooks();
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error.error;
        this.level = MessageLevel.ERROR;
      }
    });
  }

  protected readonly MessageLevel = MessageLevel;
}
