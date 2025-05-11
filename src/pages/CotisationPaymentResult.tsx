import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CotisationPaymentResult = () => {
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const payment_intent = query.get('payment_intent');
    const payment_intent_client_secret = query.get('payment_intent_client_secret');
    const redirect_status = query.get('redirect_status');

    if (!payment_intent || !payment_intent_client_secret) {
      setStatus('error');
      setLoading(false);
      return;
    }

    stripePromise.then(stripe => {
      if (!stripe) {
        setStatus('error');
        setLoading(false);
        return;
      }
      stripe.retrievePaymentIntent(payment_intent_client_secret).then(({ paymentIntent }) => {
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          setStatus('success');
          setTimeout(() => navigate('/thank-you-cotisation'), 2000);
        } else {
          setStatus('error');
        }
        setLoading(false);
      });
    });
  }, [navigate]);

  if (loading) {
    return <div className="text-center py-12 text-white">Processing your payment...</div>;
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-[#1EAEDB] mb-4">Membership Renewal Successful!</h1>
        <p className="text-lg text-[#FEF7CD]">Thank you for renewing your membership. Redirecting to your confirmation page...</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Payment Failed</h1>
      <p className="text-lg text-[#FEF7CD] mb-6">Your membership renewal payment could not be processed.</p>
      <Button onClick={() => navigate('/membership-renewal')} className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90">Return to Membership Renewal</Button>
    </div>
  );
};

export default CotisationPaymentResult; 