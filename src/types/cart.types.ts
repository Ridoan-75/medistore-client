export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock: number;
  manufacturer?: string;
}

export interface CartState {
  items: CartItem[];
}
