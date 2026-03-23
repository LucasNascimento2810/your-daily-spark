import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, MessageSquare, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Order, OrderStatus } from '@/types';
import { toast } from 'sonner';
import { useAppStore } from '@/store/app-store';

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; next?: OrderStatus; nextLabel?: string }
> = {
  pending: { label: 'Pendente', variant: 'secondary', next: 'preparing', nextLabel: 'Preparar' },
  preparing: { label: 'Preparando', variant: 'default', next: 'ready', nextLabel: 'Pronto' },
  ready: { label: 'Pronto', variant: 'outline', next: 'delivered', nextLabel: 'Entregar' },
  delivered: { label: 'Entregue', variant: 'default' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

function OrderCard({ order, onUpdateStatus }: { order: Order; onUpdateStatus: (id: string, status: OrderStatus) => void }) {
  const [open, setOpen] = useState(false);
  const config = statusConfig[order.status];
  const timeAgo = Math.max(1, Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000));

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="glass-card hover:shadow-xl transition-all">
        <Collapsible open={open} onOpenChange={setOpen}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 font-heading font-bold text-primary shrink-0">
                  {order.id.split('-')[1]}
                </div>
                <div className="min-w-0">
                  <p className="font-heading font-bold truncate">{order.customerName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {timeAgo} min atrás
                    </span>
                    <span>•</span>
                    {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-heading font-bold text-lg">
                  {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <Badge variant={config.variant}>{config.label}</Badge>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            <CollapsibleContent className="mt-4 space-y-4">
              <div className="rounded-xl bg-muted/50 p-4 space-y-2">
                {order.items.map((item, i) => (
                  <div key={`${order.id}-${i}`} className="flex justify-between text-sm gap-3">
                    <span>
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-medium whitespace-nowrap">
                      {item.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between font-heading font-bold">
                  <span>Total</span>
                  <span>{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  {order.customerPhone}
                </div>
                {order.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {order.address}
                  </div>
                )}
                {order.notes && (
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    {order.notes}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {config.next && (
                  <Button onClick={() => onUpdateStatus(order.id, config.next!)} className="flex-1">
                    {config.nextLabel}
                  </Button>
                )}
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <Button variant="destructive" onClick={() => onUpdateStatus(order.id, 'cancelled')}>
                    Cancelar
                  </Button>
                )}
              </div>
            </CollapsibleContent>
          </CardContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}

export default function OrdersPage() {
  const {
    state: { orders },
    updateOrderStatus,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState('all');

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    const labels: Record<OrderStatus, string> = {
      pending: 'Pedido marcado como pendente.',
      preparing: 'Pedido em preparo!',
      ready: 'Pedido pronto!',
      delivered: 'Pedido entregue!',
      cancelled: 'Pedido cancelado.',
    };
    toast.success(labels[status]);
  };

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const filteredOrders = activeTab === 'all' ? sortedOrders : sortedOrders.filter((order) => order.status === activeTab);

  const pendingCount = orders.filter((order) => order.status === 'pending').length;
  const preparingCount = orders.filter((order) => order.status === 'preparing').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Pedidos</h1>
        <p className="text-muted-foreground mt-1">Gerencie todos os pedidos recebidos</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all">Todos ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pendentes {pendingCount > 0 && <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">{pendingCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="preparing">
            Preparando {preparingCount > 0 && <Badge variant="default" className="ml-1.5 h-5 px-1.5">{preparingCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="ready">Prontos</TabsTrigger>
          <TabsTrigger value="delivered">Entregues</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
          ))}
          {filteredOrders.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-heading font-bold text-lg">Nenhum pedido nesta categoria</p>
              <p className="text-sm text-muted-foreground">Os pedidos aparecerão aqui quando chegarem via WhatsApp</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
