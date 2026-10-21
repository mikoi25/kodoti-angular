
export interface Customer {
  hasItems: boolean;
  items:    CustomerItem[];
  total:    number;
  page:     number;
  pages:    number;
}

export interface CustomerItem {
  clientId: number;
  name:     string;
}
