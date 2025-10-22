import {Component, OnInit} from '@angular/core';
import {PageResponseBorrowedBookResponse} from '../../../../services/models/page-response-borrowed-book-response';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ApiConfiguration} from '../../../../services/api-configuration';
import {findAllBorrowedBooks, returnBorrowedBook, saveFeedback} from '../../../../services/functions';
import {BorrowedBookResponse} from '../../../../services/models/borrowed-book-response';
import {FeedbackRequest} from '../../../../services/models/feedback-request';
import {FormsModule} from '@angular/forms';
import {Rating} from '../rating/rating';

@Component({
  selector: 'app-borrowed-book-list',
  imports: [
    FormsModule,
    Rating
  ],
  templateUrl: './borrowed-book-list.html',
  styleUrl: './borrowed-book-list.scss'
})
export class BorrowedBookList implements OnInit {
  protected borrowedBooks: PageResponseBorrowedBookResponse = {content: []};
  protected page: number = 0;
  protected size: number = 5;
  protected selectedBook: BorrowedBookResponse | undefined;
  protected feedbackRequest: FeedbackRequest = {bookId: 0, comment: '', note: 0};

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration
  ) {
  }

  ngOnInit(): void {
    this.onFindAllBorrowedBooks();
  }

  protected onReturnBorrowedBook(book: BorrowedBookResponse) {
    this.selectedBook = book;
    this.feedbackRequest.bookId = this.selectedBook.id!;
  }

  private onFindAllBorrowedBooks() {
    findAllBorrowedBooks(
      this.http,
      this.apiConfig.rootUrl,
      {
        page: this.page,
        size: this.size
      }
    ).subscribe({
      next: (response: HttpResponse<PageResponseBorrowedBookResponse>) => {
        this.borrowedBooks = response.body!;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error:', err);
      }
    });
  }


  // pagination
  protected get isLastPage(): boolean {
    return this.page === this.borrowedBooks?.totalPages as number - 1;
  }

  protected onClickGoToFirstPage(): void {
    this.page = 0;
    this.onFindAllBorrowedBooks();
  }

  protected onClickGoToPreviousPage(): void {
    this.page--;
    this.onFindAllBorrowedBooks();
  }

  protected onClickGoToPage(index: number): void {
    this.page = index;
    this.onFindAllBorrowedBooks();
  }

  protected onClickGoToNextPage(): void {
    this.page++;
    this.onFindAllBorrowedBooks();
  }

  protected onClickGoToLastPage(): void {
    this.page = this.borrowedBooks?.totalPages as number - 1;
    this.onFindAllBorrowedBooks();
  }

  protected onReturnBook(withFeedback: boolean) {
    returnBorrowedBook(
      this.http,
      this.apiConfig.rootUrl,
      {
        'book-id': this.selectedBook?.id!
      }
    ).subscribe({
      next: () => {
        if (withFeedback) {
          this.giveFeedback();
        }
        this.selectedBook = undefined;
        this.onFindAllBorrowedBooks();
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error:', err);
      }
    });
  }

  private giveFeedback(): void {
    saveFeedback(
      this.http,
      this.apiConfig.rootUrl,
      {
        body: this.feedbackRequest
      }
    ).subscribe({
      next: () => {
        this.feedbackRequest = {bookId: 0, comment: '', note: 0}
        console.log('Feedback successfully send!');
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error:', err);
      }
    });
  }
}
