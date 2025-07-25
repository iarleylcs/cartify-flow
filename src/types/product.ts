export interface Product {
  codprod: number;
  descrprod: string | null;
  codvol: string | null;
  preco: number | null;
  usoprod?: string | null;
  codmarca?: string | null;
  provider?: string | null;
  ativo?: string | null;
}

export interface CartItem {
  codprod: number;
  descrprod: string;
  codvol: string | null;
  quantity: number;
  price: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}