import { Component, input, output } from '@angular/core';

@Component({
  selector: 'shared-pagination',
  imports: [],
  templateUrl: './shared-pagination.html',
  styles: ``,
})
export class SharedPagination {
    currentPage = input.required<number>();
  totalPages = input.required<number>();
  pages = input.required<number[]>();
  pageChange = output<'first' | 'prev' | 'next' | 'last' | number>();
}
