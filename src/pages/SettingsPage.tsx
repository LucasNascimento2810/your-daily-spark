import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAppStore } from '@/store/app-store';
import { StoreSettings } from '@/types';

const paymentMethodLabels: Array<{
  key: keyof StoreSettings['paymentMethods'];
  label: string;
}> = [
  { key: 'cash', label: 'Dinheiro' },
  { key: 'pix', label: 'PIX' },
  { key: 'creditCard', label: 'Cartão de Crédito' },
  { key: 'debitCard', label: 'Cartão de Débito' },
];

export default function SettingsPage() {
  const {
    state: { settings },
    saveSettings,
    resetDemoData,
  } = useAppStore();
  const [form, setForm] = useState<StoreSettings>(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const saveAll = () => {
    saveSettings(form);
    toast.success('Configurações salvas!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground mt-1">Configurações gerais do sistema</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            resetDemoData();
            toast.success('Dados demo restaurados!');
          }}
        >
          Restaurar dados demo
        </Button>
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
              <Input
                id="storeName"
                value={form.storeName}
                onChange={(e) => setForm((prev) => ({ ...prev, storeName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Telefone</Label>
              <Input
                id="storePhone"
                value={form.storePhone}
                onChange={(e) => setForm((prev) => ({ ...prev, storePhone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Endereço</Label>
              <Input
                id="storeAddress"
                value={form.storeAddress}
                onChange={(e) => setForm((prev) => ({ ...prev, storeAddress: e.target.value }))}
              />
            </div>
            <Button onClick={saveAll}>Salvar</Button>
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
                <Input
                  type="time"
                  value={form.openingTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, openingTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Fechamento</Label>
                <Input
                  type="time"
                  value={form.closingTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, closingTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-medium">Aberto agora</p>
                <p className="text-sm text-muted-foreground">Override manual do horário</p>
              </div>
              <Switch
                checked={form.openNowOverride}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, openNowOverride: checked }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-medium">Mensagem fora do horário</p>
                <p className="text-sm text-muted-foreground">Enviar aviso quando fechado</p>
              </div>
              <Switch
                checked={form.sendClosedMessage}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, sendClosedMessage: checked }))}
              />
            </div>
            <Button onClick={saveAll}>Salvar</Button>
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
              <Input
                type="number"
                step="0.50"
                value={form.deliveryFee}
                onChange={(e) => setForm((prev) => ({ ...prev, deliveryFee: Number.parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Pedido mínimo (R$)</Label>
              <Input
                type="number"
                step="1"
                value={form.minimumOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, minimumOrder: Number.parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Tempo estimado (min)</Label>
              <Input
                type="number"
                value={form.estimatedTimeMinutes}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    estimatedTimeMinutes: Number.parseInt(e.target.value, 10) || 0,
                  }))
                }
              />
            </div>
            <Button onClick={saveAll}>Salvar</Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-heading">Pagamento</CardTitle>
            <CardDescription>Formas de pagamento aceitas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethodLabels.map((method) => (
              <div key={method.key} className="flex items-center justify-between rounded-xl border border-border p-4">
                <p className="font-medium">{method.label}</p>
                <Switch
                  checked={form.paymentMethods[method.key]}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      paymentMethods: {
                        ...prev.paymentMethods,
                        [method.key]: checked,
                      },
                    }))
                  }
                />
              </div>
            ))}
            <Button onClick={saveAll}>Salvar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
