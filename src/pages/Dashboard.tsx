import { motion } from 'framer-motion';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '@/data/mockData';

const stats = [
  {
    title: 'Pedidos Hoje',
    value: '24',
    change: '+12%',
    icon: ShoppingBag,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'Faturamento',
    value: 'R$ 1.284,50',
    change: '+8%',
    icon: DollarSign,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    title: 'Tempo Médio',
    value: '18 min',
    change: '-5%',
    icon: Clock,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    title: 'Ticket Médio',
    value: 'R$ 53,52',
    change: '+3%',
    icon: TrendingUp,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendente', variant: 'secondary' },
  preparing: { label: 'Preparando', variant: 'default' },
  ready: { label: 'Pronto', variant: 'outline' },
  delivered: { label: 'Entregue', variant: 'default' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

export default function Dashboard() {
  const recentOrders = mockOrders.slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do seu negócio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="font-heading text-2xl font-bold mt-1">{stat.value}</p>
                    <span className="text-xs text-primary font-medium">{stat.change} vs ontem</span>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-heading">Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => {
              const status = statusMap[order.status];
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-heading font-bold text-primary text-sm">
                      {order.id.split('-')[1]}
                    </div>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'} • {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-heading font-bold">
                      R$ {order.total.toFixed(2)}
                    </span>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
