import { Product, Category, Order } from '@/types';

export const mockCategories: Category[] = [
  { id: '1', name: 'Hambúrgueres', icon: '🍔' },
  { id: '2', name: 'Bebidas', icon: '🥤' },
  { id: '3', name: 'Porções', icon: '🍟' },
  { id: '4', name: 'Sobremesas', icon: '🍰' },
];

export const mockProducts: Product[] = [
  { id: '1', name: 'X-Burguer Clássico', description: 'Pão, hambúrguer artesanal 180g, queijo, alface, tomate e molho especial', price: 22.90, category: '1', available: true },
  { id: '2', name: 'X-Bacon', description: 'Pão, hambúrguer artesanal 180g, queijo, bacon crocante, alface e molho barbecue', price: 27.90, category: '1', available: true },
  { id: '3', name: 'X-Tudo', description: 'Pão, 2 hambúrgueres, queijo, bacon, ovo, presunto, alface, tomate e molho especial', price: 34.90, category: '1', available: true },
  { id: '4', name: 'Coca-Cola 350ml', description: 'Coca-Cola lata gelada', price: 6.00, category: '2', available: true },
  { id: '5', name: 'Suco Natural', description: 'Suco de laranja natural 300ml', price: 8.00, category: '2', available: true },
  { id: '6', name: 'Batata Frita', description: 'Porção de batata frita crocante 300g', price: 18.90, category: '3', available: true },
  { id: '7', name: 'Onion Rings', description: 'Anéis de cebola empanados 250g', price: 16.90, category: '3', available: false },
  { id: '8', name: 'Milk Shake', description: 'Milk shake cremoso 400ml - Chocolate, Morango ou Baunilha', price: 15.90, category: '4', available: true },
];

export const mockOrders: Order[] = [
  {
    id: 'PED-001',
    customerName: 'João Silva',
    customerPhone: '5511999887766',
    items: [
      { product: mockProducts[0], quantity: 2, subtotal: 45.80 },
      { product: mockProducts[3], quantity: 2, subtotal: 12.00 },
    ],
    total: 57.80,
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60000),
    address: 'Rua das Flores, 123 - Centro',
    notes: 'Sem cebola no X-Burguer',
  },
  {
    id: 'PED-002',
    customerName: 'Maria Santos',
    customerPhone: '5511988776655',
    items: [
      { product: mockProducts[2], quantity: 1, subtotal: 34.90 },
      { product: mockProducts[5], quantity: 1, subtotal: 18.90 },
      { product: mockProducts[4], quantity: 1, subtotal: 8.00 },
    ],
    total: 61.80,
    status: 'preparing',
    createdAt: new Date(Date.now() - 15 * 60000),
    address: 'Av. Brasil, 456 - Jardim América',
  },
  {
    id: 'PED-003',
    customerName: 'Carlos Oliveira',
    customerPhone: '5511977665544',
    items: [
      { product: mockProducts[1], quantity: 1, subtotal: 27.90 },
      { product: mockProducts[7], quantity: 1, subtotal: 15.90 },
    ],
    total: 43.80,
    status: 'ready',
    createdAt: new Date(Date.now() - 30 * 60000),
  },
  {
    id: 'PED-004',
    customerName: 'Ana Costa',
    customerPhone: '5511966554433',
    items: [
      { product: mockProducts[0], quantity: 3, subtotal: 68.70 },
      { product: mockProducts[3], quantity: 3, subtotal: 18.00 },
      { product: mockProducts[5], quantity: 2, subtotal: 37.80 },
    ],
    total: 124.50,
    status: 'delivered',
    createdAt: new Date(Date.now() - 60 * 60000),
    address: 'Rua dos Pinheiros, 789',
  },
];
