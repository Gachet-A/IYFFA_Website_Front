import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';

interface PaymentFormProps {
  amount: number;
  isSubscription?: boolean;
  onSuccess: () => void;
  email: string;
  name: string;
  address: string;
  onError?: (error: any) => void;
  isSetupIntent?: boolean;
  returnUrl?: string;
}

type PaymentStatus = 'idle' | 'processing' | 'redirecting' | 'completed';

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount, 
  isSubscription = false, 
  onSuccess, 
  email,
  name,
  address,
  onError, 
  isSetupIntent = false,
  returnUrl = '/payment-result'
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Handle return from Stripe
  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const payment_intent = query.get('payment_intent');
    const payment_intent_client_secret = query.get('payment_intent_client_secret');
    const redirect_status = query.get('redirect_status');
    
    if (payment_intent && payment_intent_client_secret && stripe) {
      setPaymentStatus('processing');
      stripe.retrievePaymentIntent(payment_intent_client_secret).then(({paymentIntent}) => {
        if (paymentIntent.status === 'succeeded') {
          navigate(returnUrl === '/payment-result' ? '/thank-you' : '/thank-you-cotisation');
        } else {
          // Handle failed payment
          toast({
            variant: "destructive",
            title: "Payment Error",
            description: "Payment failed. Please try again.",
          });
          if (onError) {
            onError(new Error('Payment failed'));
          }
          // Clear URL parameters to prevent re-triggering
          window.history.replaceState({}, document.title, location.pathname);
        }
        setPaymentStatus('completed');
      });
    }
  }, [stripe, onSuccess, onError, location.pathname, toast, navigate, returnUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // First validate the form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      if (isSetupIntent) {
        const { error: setupError } = await stripe.confirmSetup({
          elements,
          redirect: 'if_required',
        });

        if (setupError) {
          if (setupError.type === "card_error" || setupError.type === "validation_error") {
            setError(setupError.message || 'An error occurred');
          } else {
            setError('An unexpected error occurred');
          }
          throw setupError;
        }
      } else {
        const result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            // Redirect to payment result page after payment
            return_url: `${window.location.origin}${returnUrl}`,
            payment_method_data: {
              billing_details: {
                name,
                email,
                address: {
                  line1: address,
                },
              },
            },
          },
          redirect: 'if_required',
        });

        const { error: paymentError, paymentIntent } = result;

        if (paymentError) {
          if (paymentError.type === "card_error" || paymentError.type === "validation_error") {
            setError(paymentError.message || 'An error occurred');
          } else {
            setError('An unexpected error occurred');
          }
          throw paymentError;
        }

        // If paymentIntent is returned and status is succeeded, navigate to /payment-result
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          navigate(`${returnUrl}?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${paymentIntent.client_secret}&redirect_status=succeeded`);
          return;
        }
      }

      onSuccess();
    } catch (error: any) {
      console.error('Payment error:', error);
      if (onError) {
        onError(error);
      } else {
        toast({
          title: "Error",
          description: error.message || 'An error occurred while processing your payment',
          variant: "destructive"
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          defaultValues: {
            billingDetails: {
              name,
              email,
              address: {
                line1: address,
              },
            },
          },
        }}
      />
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : isSetupIntent ? 'Set Up Monthly Donation' : 'Pay Now'}
      </Button>
    </form>
  );
};

export default PaymentForm; 