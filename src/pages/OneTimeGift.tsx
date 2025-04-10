import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/PaymentForm';
import InitialDonationForm from '@/components/InitialDonationForm';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import { Modal } from '@/components/ui/modal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const OneTimeGift: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amount, setAmount] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInitialSubmit = async (data: { 
    amount: number; 
    email: string;
    name: string;
    address: string;
    consent: boolean;
  }) => {
    try {
      setIsLoading(true);
      // Validate input data
      if (!data.email || !data.name || !data.address || !data.consent) {
        throw new Error('All fields are required');
      }

      if (data.amount < 1) {
        throw new Error('Amount must be at least 1 CHF');
      }

      // Set state for the payment form
      setAmount(data.amount);
      setEmail(data.email);
      setName(data.name);
      setAddress(data.address);

      // Prepare the request data
      const requestData = {
        amount: Math.round(data.amount),
        currency: 'chf',
        email: data.email,
        name: data.name,
        address: data.address,
        payment_type: 'one_time_donation',
        payment_method_types: ['card', 'twint', 'paypal']
      };

      console.log('Sending payment intent request:', requestData);

      const response = await axios.post('http://localhost:8000/api/create_payment_intent/', requestData);
      
      // Log the complete response for debugging
      console.log('Server response:', response.data);

      // Check for clientSecret in different possible locations
      const clientSecret = response.data.clientSecret || response.data.client_secret;
      
      if (!clientSecret) {
        console.error('Response data:', response.data);
        throw new Error('No client secret received from server');
      }

      setClientSecret(clientSecret);
      setShowPaymentModal(true);
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      
      // Extract error message from response if available
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to initialize payment';

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowPaymentModal(false);
    toast({
      title: "Success",
      description: "Your donation has been processed successfully!",
      variant: "default"
    });
  };

  const handleError = (error: any) => {
    console.error('Payment error:', error);
    toast({
      title: "Error",
      description: error.message || 'Payment failed. Please try again.',
      variant: "destructive"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <InitialDonationForm onSubmit={handleInitialSubmit} isLoading={isLoading} />
      </div>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Complete Your Donation"
      >
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              amount={amount}
              email={email}
              name={name}
              address={address}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </Elements>
        )}
      </Modal>
    </div>
  );
};

export default OneTimeGift; 