export interface Product {
  hasItems: boolean;
  items: ProductItem[];
  total: number;
  page: number;
  pages: number;
}

export interface ProductItem {
  productId: number;
  name: string;
  description: string;
  price: number;
 
}



export interface ProductInStock {
  hasItems: boolean;
  items: ProductInStockItem[];
  total: number;
  page: number;
  pages: number;
}

export interface ProductInStockItem {
  productInStockId: number;
  productId: number;
  stock: number;
}


export interface ProductItemCart{
 
  productId: number;
  unitPrice: number;
  quantity: number;

}


export interface Carrito{
  paymentType:number;
  clientId:number
  items: ProductItemCart[]
}