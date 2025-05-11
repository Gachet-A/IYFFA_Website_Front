import React, { useState, useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/PaymentForm';
import { useToast } from '@/hooks/use-toast';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const MembershipRenewal: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [address, setAddress] = useState('');
  const [consent, setConsent] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) {
    return <div className="text-center py-12">You must be logged in to renew your membership.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast({ title: 'Error', description: 'Address is required', variant: 'destructive' });
      return;
    }
    if (!consent) {
      toast({ title: 'Error', description: 'You must accept the terms to proceed', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/membership_renewal_intent/', {
        address
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      });
      if (!response.data.clientSecret) {
        throw new Error('No client secret received from server');
      }
      setClientSecret(response.data.clientSecret);
      setShowPaymentModal(true);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to initialize payment';
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowPaymentModal(false);
    navigate('/thank-you');
  };

  const handleError = (error: any) => {
    setShowPaymentModal(false);
    toast({
      title: 'Payment Error',
      description: error.message || 'Payment failed. Please try again.',
      variant: 'destructive'
    });
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1EAEDB] mb-4">Membership Renewal</h1>
        <p className="text-[#FEF7CD] text-lg max-w-2xl mx-auto">
          Renew your membership for another year and continue supporting our mission.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-[#1A1F2C] border-[#1EAEDB]/20 rounded-lg p-8 space-y-6">
        <div>
          <label className="text-white block mb-1">Name</label>
          <Input value={`${user.name} ${user.surname}`} disabled className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20" />
        </div>
        <div>
          <label className="text-white block mb-1">Email</label>
          <Input value={user.email} disabled className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20" />
        </div>
        <div>
          <label className="text-white block mb-1">Address</label>
          <Input
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
            placeholder="Enter your address"
            className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={checked => setConsent(!!checked)}
            required
          />
          <label htmlFor="consent" className="text-sm text-white">
            I agree to the{' '}
            <a href="/terms" className="text-[#1EAEDB] hover:underline" target="_blank" rel="noopener noreferrer">
              Terms & Data Protection Policy
            </a>
            {' '}and consent to the collection and processing of my data for legal purposes.
          </label>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg text-[#FEF7CD] font-bold">Membership Fee: 50 CHF</span>
          <Button type="submit" className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Pay for renewal'}
          </Button>
        </div>
      </form>
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Complete Your Membership Renewal"
      >
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              amount={50}
              email={user.email}
              name={`${user.name} ${user.surname}`}
              address={address}
              onSuccess={handleSuccess}
              onError={handleError}
              returnUrl="/cotisation-payment-result"
            />
          </Elements>
        )}
      </Modal>
    </div>
  );
};

export default MembershipRenewal; 