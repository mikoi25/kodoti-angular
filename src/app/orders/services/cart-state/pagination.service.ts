import { computed, signal, Signal } from "@angular/core";

export class PaginationService<T> {
  readonly pageSize = signal(4);
  readonly currentPage = signal(1);

  readonly totalPages: Signal<number>;
  readonly pageNumbers: Signal<number[]>;
  readonly paginatedItems: Signal<T[]>;

  constructor(private data: Signal<T[]>) {
    this.totalPages = computed(() =>
      Math.max(1, Math.ceil(this.data().length / this.pageSize()))
    );

    this.pageNumbers = computed(() =>
      Array.from({ length: this.totalPages() }, (_, i) => i + 1)
    );

    this.paginatedItems = computed(() => {
      const start = (this.currentPage() - 1) * this.pageSize();
      return this.data().slice(start, start + this.pageSize());
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  setPageSize(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  adjustCurrentPage() {
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(this.totalPages());
    }
  }
}