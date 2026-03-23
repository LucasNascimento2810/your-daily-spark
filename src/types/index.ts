export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type WhatsAppProvider = 'evolution' | 'zapi';

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

export interface OrderItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  address?: string;
  notes?: string;
}

export interface WhatsAppConfig {
  provider: WhatsAppProvider;
  apiUrl: string;
  apiKey: string;
  instanceName: string;
  connected: boolean;
}

export interface ChatbotTemplates {
  orderReceived: string;
  orderPreparing: string;
  orderReady: string;
}

export interface ChatbotConfig {
  autoReply: boolean;
  greeting: string;
  templates: ChatbotTemplates;
}

export interface PaymentMethods {
  cash: boolean;
  pix: boolean;
  creditCard: boolean;
  debitCard: boolean;
}

export interface StoreSettings {
  storeName: string;
  storePhone: string;
  storeAddress: string;
  openingTime: string;
  closingTime: string;
  openNowOverride: boolean;
  sendClosedMessage: boolean;
  deliveryFee: number;
  minimumOrder: number;
  estimatedTimeMinutes: number;
  paymentMethods: PaymentMethods;
}

export interface AppState {
  categories: Category[];
  products: Product[];
  orders: Order[];
  whatsapp: WhatsAppConfig;
  chatbot: ChatbotConfig;
  settings: StoreSettings;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  available?: boolean;
}
