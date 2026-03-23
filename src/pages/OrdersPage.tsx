import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, MessageSquare, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { mockOrders } from '@/data/mockData';
import { Order } from '@/types';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; next?: string; nextLabel?: string }> = {
  pending: { label: 'Pendente', variant: 'secondary', next: 'preparing', nextLabel: 'Preparar' },
  preparing: { label: 'Preparando', variant: 'default', next: 'ready', nextLabel: 'Pronto' },
  ready: { label: 'Pronto', variant: 'outline', next: 'delivered', nextLabel: 'Entregar' },
  delivered: { label: 'Entregue', variant: 'default' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

function OrderCard({ order, onUpdateStatus }: { order: Order; onUpdateStatus: (id: string, status: Order['status']) => void }) {
  const [open, setOpen] = useState(false);
  const config = statusConfig[order.status];
  const timeAgo = Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000);

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="glass-card hover:shadow-xl transition-all">
        <Collapsible open={open} onOpenChange={setOpen}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 font-heading font-bold text-primary">
                  {order.id.split('-')[1]}
                </div>
                <div>
                  <p className="font-heading font-bold">{order.customerName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" /> {timeAgo} min atrás
                    <span>•</span>
                    {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-heading font-bold text-lg">R$ {order.total.toFixed(2)}</span>
                <Badge variant={config.variant}>{config.label}</Badge>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            <CollapsibleContent className="mt-4 space-y-4">
              {/* Items */}
              <div className="rounded-xl bg-muted/50 p-4 space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span className="font-medium">R$ {item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between font-heading font-bold">
                  <span>Total</span>
                  <span>R$ {order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Info */}
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

              {/* Actions */}
              <div className="flex gap-2">
                {config.next && (
                  <Button
                    onClick={() => onUpdateStatus(order.id, config.next as Order['status'])}
                    className="flex-1"
                  >
                    {config.nextLabel}
                  </Button>
                )}
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <Button
                    variant="destructive"
                    onClick={() => onUpdateStatus(order.id, 'cancelled')}
                  >
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
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState('all');

  const handleUpdateStatus = (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    const labels: Record<string, string> = {
      preparing: 'Pedido em preparo!',
      ready: 'Pedido pronto!',
      delivered: 'Pedido entregue!',
      cancelled: 'Pedido cancelado.',
    };
    toast.success(labels[status]);
  };

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.status === activeTab);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;

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
