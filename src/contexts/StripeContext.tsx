import { createContext, useContext, useState, ReactNode } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

interface StripeContextType {
  clientSecret: string | null;
  setClientSecret: (secret: string | null) => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeContext = createContext<StripeContextType | null>(null);

export function StripeProvider({ children }: { children: ReactNode }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  return (
    <StripeContext.Provider value={{ clientSecret, setClientSecret }}>
      {children}
    </StripeContext.Provider>
  );
}

export function useStripe() {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
}

export { stripePromise }; 