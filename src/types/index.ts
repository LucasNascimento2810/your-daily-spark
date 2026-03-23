export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: Date;
  address?: string;
  notes?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface WhatsAppConfig {
  provider: 'evolution' | 'zapi';
  apiUrl: string;
  apiKey: string;
  instanceName: string;
  connected: boolean;
}
