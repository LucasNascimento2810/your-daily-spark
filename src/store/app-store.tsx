import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { initialAppState } from '@/data/seedData';
import { AppState, OrderStatus, Product, ProductInput, StoreSettings, WhatsAppConfig, ChatbotConfig } from '@/types';

const STORAGE_KEY = 'zaplanche-app-state-v1';

interface AppStoreContextValue {
  state: AppState;
  hydrated: boolean;
  addProduct: (input: ProductInput) => void;
  updateProduct: (id: string, input: ProductInput) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  saveSettings: (settings: StoreSettings) => void;
  saveWhatsAppConfig: (config: WhatsAppConfig) => void;
  saveChatbotConfig: (config: ChatbotConfig) => void;
  resetDemoData: () => void;
}

const AppStoreContext = createContext<AppStoreContextValue | null>(null);

function loadInitialState(): AppState {
  if (typeof window === 'undefined') return initialAppState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialAppState;

    const parsed = JSON.parse(raw) as Partial<AppState>;

    return {
      ...initialAppState,
      ...parsed,
      whatsapp: {
        ...initialAppState.whatsapp,
        ...parsed.whatsapp,
      },
      chatbot: {
        ...initialAppState.chatbot,
        ...parsed.chatbot,
        templates: {
          ...initialAppState.chatbot.templates,
          ...parsed.chatbot?.templates,
        },
      },
      settings: {
        ...initialAppState.settings,
        ...parsed.settings,
        paymentMethods: {
          ...initialAppState.settings.paymentMethods,
          ...parsed.settings?.paymentMethods,
        },
      },
      categories: parsed.categories ?? initialAppState.categories,
      products: parsed.products ?? initialAppState.products,
      orders: parsed.orders ?? initialAppState.orders,
    };
  } catch {
    return initialAppState;
  }
}

function syncOrderProducts(state: AppState): AppState {
  const productMap = new Map(state.products.map((product) => [product.id, product]));

  return {
    ...state,
    orders: state.orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: productMap.get(item.product.id) ?? item.product,
      })),
    })),
  };
}

export function AppStoreProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppState>(loadInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const value = useMemo<AppStoreContextValue>(
    () => ({
      state,
      hydrated,
      addProduct: (input) => {
        const nextProduct: Product = {
          id: crypto.randomUUID(),
          name: input.name,
          description: input.description,
          price: input.price,
          category: input.category,
          available: input.available ?? true,
        };

        setState((prev) => ({
          ...prev,
          products: [...prev.products, nextProduct],
        }));
      },
      updateProduct: (id, input) => {
        setState((prev) =>
          syncOrderProducts({
            ...prev,
            products: prev.products.map((product) =>
              product.id === id
                ? {
                    ...product,
                    name: input.name,
                    description: input.description,
                    price: input.price,
                    category: input.category,
                    available: input.available ?? product.available,
                  }
                : product
            ),
          })
        );
      },
      deleteProduct: (id) => {
        setState((prev) => ({
          ...prev,
          products: prev.products.filter((product) => product.id !== id),
        }));
      },
      toggleProductAvailability: (id) => {
        setState((prev) =>
          syncOrderProducts({
            ...prev,
            products: prev.products.map((product) =>
              product.id === id ? { ...product, available: !product.available } : product
            ),
          })
        );
      },
      updateOrderStatus: (id, status) => {
        setState((prev) => ({
          ...prev,
          orders: prev.orders.map((order) => (order.id === id ? { ...order, status } : order)),
        }));
      },
      saveSettings: (settings) => {
        setState((prev) => ({ ...prev, settings }));
      },
      saveWhatsAppConfig: (config) => {
        setState((prev) => ({ ...prev, whatsapp: config }));
      },
      saveChatbotConfig: (config) => {
        setState((prev) => ({ ...prev, chatbot: config }));
      },
      resetDemoData: () => {
        setState(initialAppState);
      },
    }),
    [hydrated, state]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }

  return context;
}
