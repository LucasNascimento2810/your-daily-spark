import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Bot, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAppStore } from '@/store/app-store';
import { ChatbotConfig, WhatsAppConfig, WhatsAppProvider } from '@/types';

export default function WhatsAppPage() {
  const {
    state: { whatsapp, chatbot },
    saveWhatsAppConfig,
    saveChatbotConfig,
  } = useAppStore();

  const [config, setConfig] = useState<WhatsAppConfig>(whatsapp);
  const [chatbotForm, setChatbotForm] = useState<ChatbotConfig>(chatbot);

  useEffect(() => setConfig(whatsapp), [whatsapp]);
  useEffect(() => setChatbotForm(chatbot), [chatbot]);

  const handleConnect = () => {
    if (!config.apiUrl || !config.apiKey || !config.instanceName) {
      toast.error('Preencha todos os campos de configuração');
      return;
    }

    const nextConfig = { ...config, connected: true };
    setConfig(nextConfig);
    saveWhatsAppConfig(nextConfig);
    toast.success('Conexão estabelecida com sucesso!');
  };

  const handleDisconnect = () => {
    const nextConfig = { ...config, connected: false };
    setConfig(nextConfig);
    saveWhatsAppConfig(nextConfig);
    toast.info('Desconectado');
  };

  const saveConnection = () => {
    saveWhatsAppConfig(config);
    toast.success('Configurações da conexão salvas!');
  };

  const saveChatbot = () => {
    saveChatbotConfig(chatbotForm);
    toast.success('Configurações do chatbot salvas!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">WhatsApp</h1>
        <p className="text-muted-foreground mt-1">Configure a integração com WhatsApp para pedidos automáticos</p>
      </div>

      <Tabs defaultValue="connection">
        <TabsList>
          <TabsTrigger value="connection">Conexão</TabsTrigger>
          <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="mt-4 space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${config.connected ? 'bg-success/10' : 'bg-muted'}`}>
                      {config.connected ? <Wifi className="h-7 w-7 text-success" /> : <WifiOff className="h-7 w-7 text-muted-foreground" />}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg">{config.connected ? 'Conectado' : 'Desconectado'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {config.connected
                          ? `Instância: ${config.instanceName} • ${config.provider === 'evolution' ? 'Evolution API' : 'Z-API'}`
                          : 'Configure sua API para começar a receber pedidos'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={config.connected ? 'default' : 'secondary'} className={config.connected ? 'bg-success text-success-foreground' : ''}>
                    {config.connected ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-heading">Configuração da API</CardTitle>
                <CardDescription>Conecte sua instância do Evolution API ou Z-API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Provedor</Label>
                  <Select
                    value={config.provider}
                    onValueChange={(value: WhatsAppProvider) => setConfig((prev) => ({ ...prev, provider: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evolution">Evolution API</SelectItem>
                      <SelectItem value="zapi">Z-API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiUrl">URL da API</Label>
                  <Input
                    id="apiUrl"
                    placeholder={config.provider === 'evolution' ? 'https://sua-evolution-api.com' : 'https://api.z-api.io'}
                    value={config.apiUrl}
                    onChange={(e) => setConfig((prev) => ({ ...prev, apiUrl: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key / Token</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Sua chave de API"
                    value={config.apiKey}
                    onChange={(e) => setConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instance">Nome da Instância</Label>
                  <Input
                    id="instance"
                    placeholder="minha-lanchonete"
                    value={config.instanceName}
                    onChange={(e) => setConfig((prev) => ({ ...prev, instanceName: e.target.value }))}
                  />
                </div>

                <div className="flex gap-3 flex-wrap">
                  {!config.connected ? (
                    <Button onClick={handleConnect} className="flex-1 gap-2 min-w-[180px]">
                      <Wifi className="h-4 w-4" /> Conectar
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={handleDisconnect} className="flex-1 gap-2 min-w-[180px]">
                      <WifiOff className="h-4 w-4" /> Desconectar
                    </Button>
                  )}
                  <Button variant="outline" onClick={saveConnection} className="min-w-[180px]">
                    Salvar Configuração
                  </Button>
                </div>

                <div className="rounded-xl bg-muted/50 p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Precisa de ajuda?</p>
                    <p>
                      {config.provider === 'evolution'
                        ? 'Instale o Evolution API no seu servidor ou use um serviço de hospedagem. Documentação em evolution-api.com'
                        : 'Crie sua conta em z-api.io e obtenha suas credenciais no painel.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="chatbot" className="mt-4 space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Bot className="h-5 w-5" /> Configuração do Chatbot
              </CardTitle>
              <CardDescription>Personalize as respostas automáticas do bot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="font-medium">Resposta automática</p>
                  <p className="text-sm text-muted-foreground">Ativar chatbot para responder automaticamente</p>
                </div>
                <Switch
                  checked={chatbotForm.autoReply}
                  onCheckedChange={(checked) => setChatbotForm((prev) => ({ ...prev, autoReply: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Mensagem de Boas-Vindas</Label>
                <Textarea
                  value={chatbotForm.greeting}
                  onChange={(e) => setChatbotForm((prev) => ({ ...prev, greeting: e.target.value }))}
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">Use *texto* para negrito e _texto_ para itálico no WhatsApp</p>
              </div>

              <Button onClick={saveChatbot}>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="mt-4 space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-heading">Mensagens Personalizadas</CardTitle>
              <CardDescription>Configure as mensagens para cada etapa do pedido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pedido Recebido</Label>
                <Textarea
                  value={chatbotForm.templates.orderReceived}
                  onChange={(e) =>
                    setChatbotForm((prev) => ({
                      ...prev,
                      templates: { ...prev.templates, orderReceived: e.target.value },
                    }))
                  }
                  rows={3}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Pedido em Preparo</Label>
                <Textarea
                  value={chatbotForm.templates.orderPreparing}
                  onChange={(e) =>
                    setChatbotForm((prev) => ({
                      ...prev,
                      templates: { ...prev.templates, orderPreparing: e.target.value },
                    }))
                  }
                  rows={3}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Pedido Pronto</Label>
                <Textarea
                  value={chatbotForm.templates.orderReady}
                  onChange={(e) =>
                    setChatbotForm((prev) => ({
                      ...prev,
                      templates: { ...prev.templates, orderReady: e.target.value },
                    }))
                  }
                  rows={3}
                  className="font-mono text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Variáveis: {'{id}'} = nº pedido, {'{items}'} = itens, {'{total}'} = total, {'{name}'} = nome do cliente
              </p>
              <Button onClick={saveChatbot}>Salvar Mensagens</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
