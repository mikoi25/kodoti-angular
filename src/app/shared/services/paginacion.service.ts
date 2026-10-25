import { computed, effect, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pages: number;
  total: number;
  hasItems: boolean;
}

export interface PagedSearchOptions<T> {
  /** Cómo pedir una página al backend: (page, perPage) => Observable<PagedResponse<T>> */
  fetchPage: (page: number, perPage: number) => Observable<PagedResponse<T>>;
  /** Cómo decide un item si matchea el término de búsqueda (ya en minúsculas). */
  matches: (item: T, term: string) => boolean;
  initialPerPage?: number;
}

export function createPagedSearch<T>(options: PagedSearchOptions<T>) {
  const perPage = signal(options.initialPerPage ?? 10);
  const currentPage = signal(1);
  const searchTerm = signal('');

  const isSearching = computed(() => searchTerm().trim().length > 0);

  // Paginado normal del servidor (cuando NO se busca).
  const pagedResource = rxResource({
    params: () => (isSearching() ? undefined : { page: currentPage(), perPage: perPage() }),
    stream: ({ params }) => options.fetchPage(params!.page, params!.perPage),
  });

  // Guardamos el total conocido aparte: pagedResource se "pausa" al buscar
  // y no queremos perder ese dato mientras tanto.
  const knownTotal = signal(0);
  effect(() => {
    const t = pagedResource.value()?.total;
    if (t !== undefined) knownTotal.set(t);
  });
  const total = computed(() => knownTotal());

  // Solo se activa mientras se busca: trae TODO el dataset de una vez.
  const searchAllResource = rxResource({
    params: () => (isSearching() ? { page: 1, perPage: Math.max(total(), 1) } : undefined),
    stream: ({ params }) => options.fetchPage(params!.page, params!.perPage),
  });

  const loading = computed(() =>
    isSearching() ? searchAllResource.isLoading() : pagedResource.isLoading()
  );

  const items = computed<T[]>(() =>
    isSearching() ? searchAllResource.value()?.items ?? [] : pagedResource.value()?.items ?? []
  );

  const filtered = computed(() => {
    const term = searchTerm().trim().toLowerCase();
    const all = items();
    if (!term) return all;
    return all.filter((item) => options.matches(item, term));
  });

  const totalPages = computed(() =>
    isSearching()
      ? Math.max(1, Math.ceil(filtered().length / perPage()))
      : pagedResource.value()?.pages ?? 1
  );

  // Sin búsqueda: el backend ya entregó exactamente esta página, no se re-slicea.
  // Con búsqueda: se pagina en cliente sobre el resultado filtrado completo.
  const pageItems = computed(() => {
    if (!isSearching()) return items();
    const start = (currentPage() - 1) * perPage();
    return filtered().slice(start, start + perPage());
  });

  const resultsLabel = computed(() => {
    const totalMatches = isSearching() ? filtered().length : total();
    const pageSize = pageItems().length;
    const start = pageSize ? (currentPage() - 1) * perPage() + 1 : 0;
    const end = start + pageSize - (start ? 1 : 0);
    return `Mostrando ${start} a ${totalMatches ? end : 0} de ${totalMatches} registros`;
  });

  const pages = computed(() => Array.from({ length: totalPages() }, (_, i) => i + 1));

  function onPerPageChange(value: string): void {
    perPage.set(Number(value));
    currentPage.set(1);
  }

  function onSearchChange(value: string): void {
    searchTerm.set(value);
    currentPage.set(1);
  }

  function goTo(page: 'first' | 'prev' | 'next' | 'last' | number): void {
    const tp = totalPages();
    if (page === 'first') currentPage.set(1);
    else if (page === 'prev') currentPage.set(Math.max(1, currentPage() - 1));
    else if (page === 'next') currentPage.set(Math.min(tp, currentPage() + 1));
    else if (page === 'last') currentPage.set(tp);
    else currentPage.set(page);
  }

  return {
    perPage, currentPage, searchTerm, isSearching,
    total, loading, filtered, totalPages, pageItems, resultsLabel, pages,
    onPerPageChange, onSearchChange, goTo,
  };
}