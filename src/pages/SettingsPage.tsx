import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">Configurações gerais do sistema</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-heading">Dados da Lanchonete</CardTitle>
            <CardDescription>Informações básicas do seu negócio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nome</Label>
              <Input id="storeName" defaultValue="ZapLanche" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Telefone</Label>
              <Input id="storePhone" defaultValue="(11) 99988-7766" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Endereço</Label>
              <Input id="storeAddress" defaultValue="Rua Exemplo, 123 - Centro" />
            </div>
            <Button onClick={() => toast.success('Dados salvos!')}>Salvar</Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-heading">Horário de Funcionamento</CardTitle>
            <CardDescription>Define quando o bot estará ativo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Abertura</Label>
                <Input type="time" defaultValue="18:00" />
              </div>
              <div className="space-y-2">
                <Label>Fechamento</Label>
                <Input type="time" defaultValue="23:00" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-medium">Aberto agora</p>
                <p className="text-sm text-muted-foreground">Override manual do horário</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-medium">Mensagem fora do horário</p>
                <p className="text-sm text-muted-foreground">Enviar aviso quando fechado</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button onClick={() => toast.success('Horários salvos!')}>Salvar</Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-heading">Entrega</CardTitle>
            <CardDescription>Configure taxas e áreas de entrega</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Taxa de Entrega (R$)</Label>
              <Input type="number" step="0.50" defaultValue="5.00" />
            </div>
            <div className="space-y-2">
              <Label>Pedido mínimo (R$)</Label>
              <Input type="number" step="1" defaultValue="15.00" />
            </div>
            <div className="space-y-2">
              <Label>Tempo estimado (min)</Label>
              <Input type="number" defaultValue="30" />
            </div>
            <Button onClick={() => toast.success('Configurações de entrega salvas!')}>Salvar</Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-heading">Pagamento</CardTitle>
            <CardDescription>Formas de pagamento aceitas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Dinheiro', 'PIX', 'Cartão de Crédito', 'Cartão de Débito'].map((method) => (
              <div key={method} className="flex items-center justify-between rounded-xl border border-border p-4">
                <p className="font-medium">{method}</p>
                <Switch defaultChecked />
              </div>
            ))}
            <Button onClick={() => toast.success('Pagamentos salvos!')}>Salvar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
