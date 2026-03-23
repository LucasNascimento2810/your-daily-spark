import { AppState, Category, Order, Product } from '@/types';

export const seedCategories: Category[] = [
  { id: '1', name: 'Hambúrgueres', icon: '🍔' },
  { id: '2', name: 'Bebidas', icon: '🥤' },
  { id: '3', name: 'Porções', icon: '🍟' },
  { id: '4', name: 'Sobremesas', icon: '🍰' },
];

export const seedProducts: Product[] = [
  { id: '1', name: 'X-Burguer Clássico', description: 'Pão, hambúrguer artesanal 180g, queijo, alface, tomate e molho especial', price: 22.9, category: '1', available: true },
  { id: '2', name: 'X-Bacon', description: 'Pão, hambúrguer artesanal 180g, queijo, bacon crocante, alface e molho barbecue', price: 27.9, category: '1', available: true },
  { id: '3', name: 'X-Tudo', description: 'Pão, 2 hambúrgueres, queijo, bacon, ovo, presunto, alface, tomate e molho especial', price: 34.9, category: '1', available: true },
  { id: '4', name: 'Coca-Cola 350ml', description: 'Coca-Cola lata gelada', price: 6, category: '2', available: true },
  { id: '5', name: 'Suco Natural', description: 'Suco de laranja natural 300ml', price: 8, category: '2', available: true },
  { id: '6', name: 'Batata Frita', description: 'Porção de batata frita crocante 300g', price: 18.9, category: '3', available: true },
  { id: '7', name: 'Onion Rings', description: 'Anéis de cebola empanados 250g', price: 16.9, category: '3', available: false },
  { id: '8', name: 'Milk Shake', description: 'Milk shake cremoso 400ml - Chocolate, Morango ou Baunilha', price: 15.9, category: '4', available: true },
];

export const seedOrders: Order[] = [
  {
    id: 'PED-001',
    customerName: 'João Silva',
    customerPhone: '5511999887766',
    items: [
      { product: seedProducts[0], quantity: 2, subtotal: 45.8 },
      { product: seedProducts[3], quantity: 2, subtotal: 12 },
    ],
    total: 57.8,
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    address: 'Rua das Flores, 123 - Centro',
    notes: 'Sem cebola no X-Burguer',
  },
  {
    id: 'PED-002',
    customerName: 'Maria Santos',
    customerPhone: '5511988776655',
    items: [
      { product: seedProducts[2], quantity: 1, subtotal: 34.9 },
      { product: seedProducts[5], quantity: 1, subtotal: 18.9 },
      { product: seedProducts[4], quantity: 1, subtotal: 8 },
    ],
    total: 61.8,
    status: 'preparing',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    address: 'Av. Brasil, 456 - Jardim América',
  },
  {
    id: 'PED-003',
    customerName: 'Carlos Oliveira',
    customerPhone: '5511977665544',
    items: [
      { product: seedProducts[1], quantity: 1, subtotal: 27.9 },
      { product: seedProducts[7], quantity: 1, subtotal: 15.9 },
    ],
    total: 43.8,
    status: 'ready',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'PED-004',
    customerName: 'Ana Costa',
    customerPhone: '5511966554433',
    items: [
      { product: seedProducts[0], quantity: 3, subtotal: 68.7 },
      { product: seedProducts[3], quantity: 3, subtotal: 18 },
      { product: seedProducts[5], quantity: 2, subtotal: 37.8 },
    ],
    total: 124.5,
    status: 'delivered',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    address: 'Rua dos Pinheiros, 789',
  },
];

export const initialAppState: AppState = {
  categories: seedCategories,
  products: seedProducts,
  orders: seedOrders,
  whatsapp: {
    provider: 'evolution',
    apiUrl: '',
    apiKey: '',
    instanceName: '',
    connected: false,
  },
  chatbot: {
    autoReply: true,
    greeting:
      'Olá! 👋 Bem-vindo à *ZapLanche*!\n\nEscolha uma opção:\n1️⃣ Ver cardápio\n2️⃣ Fazer pedido\n3️⃣ Acompanhar pedido\n4️⃣ Falar com atendente',
    templates: {
      orderReceived: '✅ Pedido #{id} recebido!\n\nItens:\n{items}\n\nTotal: R$ {total}\n\nPrevisão: ~20 min',
      orderPreparing: '👨‍🍳 Seu pedido #{id} está sendo preparado!',
      orderReady: '🎉 Pedido #{id} pronto!\n\n{delivery_msg}',
    },
  },
  settings: {
    storeName: 'ZapLanche',
    storePhone: '(11) 99988-7766',
    storeAddress: 'Rua Exemplo, 123 - Centro',
    openingTime: '18:00',
    closingTime: '23:00',
    openNowOverride: true,
    sendClosedMessage: true,
    deliveryFee: 5,
    minimumOrder: 15,
    estimatedTimeMinutes: 30,
    paymentMethods: {
      cash: true,
      pix: true,
      creditCard: true,
      debitCard: true,
    },
  },
};
