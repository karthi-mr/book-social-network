import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BookResponse} from '../../../../services/models/book-response';

@Component({
  selector: 'app-book-card',
  imports: [],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss'
})
export class BookCard {
  private _book: BookResponse = {};
  private _bookCover: string | undefined;
  private _manage: boolean = false;

  get book(): BookResponse {
    return this._book;
  }

  @Input()
  set book(value: BookResponse) {
    this._book = value;
  }

  get bookCover(): string | undefined {
    if (this._book.cover) {
      this._bookCover = `data:image/jpg;base64, ${this.book.cover}`;
    } else {
      this._bookCover = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
    }
    return this._bookCover;
  }

  get manage(): boolean {
    return this._manage;
  }

  @Input()
  set manage(value: boolean) {
    this._manage = value;
  }

  @Output() private share: EventEmitter<BookResponse> = new EventEmitter<BookResponse>;
  @Output() private archive: EventEmitter<BookResponse> = new EventEmitter<BookResponse>;
  @Output() private addToWaitingList: EventEmitter<BookResponse> = new EventEmitter<BookResponse>;
  @Output() private borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>;
  @Output() private edit: EventEmitter<BookResponse> = new EventEmitter<BookResponse>;
  @Output() private details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>;

  protected onShowDetails() {
    this.details.emit(this.book);
  }

  protected onBorrow() {
    this.borrow.emit(this.book);
  }

  protected onAddWaitingList() {
    this.addToWaitingList.emit(this.book);
  }

  protected onEdit() {
    this.edit.emit(this.book);
  }

  protected onShare() {
    this.share.emit(this.book);
  }

  protected onArchive() {
    this.archive.emit(this.book);
  }
}
