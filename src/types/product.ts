export interface Product {
  codprod: number;
  descrprod: string | null;
  codvol: string | null;
  preco: number | null;
  usoprod?: string | null;
  origprod?: number | null;
  ativo?: string | null;
  local?: string | null;
  usalocal?: string | null;
  codvolcompra?: string | null;
  codmarca?: string | null;
  decvlr?: number | null;
  decqtd?: number | null;
  tipocontest?: string | null;
  labelcontest?: string | null;
  provider?: string | null;
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