import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import InitialDonationForm from '../components/InitialDonationForm';
import PaymentForm from '../components/PaymentForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const MonthlySupport = () => {
  const [showModal, setShowModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [donorInfo, setDonorInfo] = useState<{ name: string; email: string; amount: number; address: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInitialSubmit = async (data: { 
    email: string; 
    amount: number;
    name: string;
    address: string;
    consent: boolean;
  }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/create_monthly_subscription/', {
        amount: data.amount,
        email: data.email,
        name: data.name,
        address: data.address
      });

      if (!response.data.clientSecret) {
        throw new Error('No client secret received from server');
      }

      setClientSecret(response.data.clientSecret);
      setDonorInfo({ 
        name: data.name, 
        email: data.email,
        amount: data.amount,
        address: data.address
      });
      setShowModal(true);
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || 'Failed to initialize subscription',
        variant: "destructive"
      });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setClientSecret(null);
    setDonorInfo(null);
  };

  const handlePaymentSuccess = () => {
    handleModalClose();
    toast({
      title: "Success",
      description: "Your monthly donation has been set up successfully!",
      variant: "default"
    });
    navigate('/thank-you');
  };

  const handlePaymentError = (error: any) => {
    toast({
      title: "Error",
      description: error.message || 'Failed to process payment',
      variant: "destructive"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        
        <CardContent>
          <InitialDonationForm
            isSubscription={true}
            onSubmit={handleInitialSubmit}
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title="Complete Your Monthly Donation"
      >
        {clientSecret && donorInfo && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              amount={donorInfo.amount}
              email={donorInfo.email}
              name={donorInfo.name}
              address={donorInfo.address}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              isSetupIntent={true}
            />
          </Elements>
        )}
      </Modal>
    </div>
  );
};

export default MonthlySupport; 