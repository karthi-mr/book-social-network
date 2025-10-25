import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-rating',
  imports: [],
  templateUrl: './rating.html',
  styleUrl: './rating.scss'
})
export class Rating {

  @Input()
  public rating: number = 0;

  protected maxRating: number = 5;

  protected get fullStars(): number {
    return Math.floor(this.rating);
  }

  protected get hasHalfStar(): boolean {
    return this.rating % 1 !== 0;
  }

  protected  get emptyStars(): number {
    return this.maxRating - Math.ceil(this.rating);
  }
}
