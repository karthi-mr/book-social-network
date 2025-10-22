import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BookRequest} from '../../../../services/models/book-request';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {findBookById, saveBook, uploadBookCoverPicture} from '../../../../services/functions';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ApiConfiguration} from '../../../../services/api-configuration';
import {BookResponse} from '../../../../services/models/book-response';

@Component({
  selector: 'app-manage-book',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './manage-book.html',
  styleUrl: './manage-book.scss'
})
export class ManageBook implements OnInit {
  protected errorMsg: Array<string> = [];
  protected selectedBookCover: any;
  protected selectedPicture: string | undefined;
  protected bookRequest: BookRequest = {authorName: '', isbn: '', synopsis: '', title: ''}

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfiguration,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const bookId = this.activatedRoute.snapshot.params['bookId'];

    if (bookId) {
      findBookById(
        this.http,
        this.apiConfig.rootUrl,
        {
          'book-id': bookId
        }
      ).subscribe({
        next: (response: HttpResponse<BookResponse>) => {
          const book: BookResponse = response.body as BookResponse;

          this.bookRequest = {
            id: book.id,
            authorName: book.authorName!,
            title: book.title!,
            isbn: book.isbn!,
            synopsis: book.synopsis!,
            shareable: book.shareable
          };
          if (book.cover) {
            this.selectedPicture = `data:image/jpg;base64, ${book.cover}`
            this.selectedBookCover = book.cover
          }
        }
      })
    }
  }

  protected onFileSelected(event: any) {
    this.selectedBookCover = event.target.files[0];
    console.log(this.selectedBookCover);

    if (this.selectedBookCover) {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      }
      reader.readAsDataURL(this.selectedBookCover);
    }
  }

  onSaveBook() {
    saveBook(
      this.http,
      this.apiConfig.rootUrl,
      {body: this.bookRequest}
    ).subscribe({
      next: (res: HttpResponse<number>) => {
        console.log('Res:', res);
        const bookId: number = res.body as number;
        uploadBookCoverPicture(
          this.http,
          this.apiConfig.rootUrl,
          {
            'book-id': bookId,
            body: {
              file: this.selectedBookCover
            }
          }
        ).subscribe(({
          next: () => {
            this.router.navigate(['books', 'my-books']);
          }
        }))
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error:', err);
        this.errorMsg = err.error.validationErrors;
      }
    });
  }
}
