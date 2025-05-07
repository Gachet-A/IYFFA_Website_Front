import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface InitialDonationFormProps {
  onSubmit: (data: { amount: number; email: string; name: string; address: string; consent: boolean }) => void;
  isLoading?: boolean;
  isSubscription?: boolean;
}

const InitialDonationForm: React.FC<InitialDonationFormProps> = ({ onSubmit, isLoading = false, isSubscription = false }) => {
  const [amount, setAmount] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
    if (!address) {
      newErrors.address = 'Address is required';
    }
    
    if (!consent) {
      newErrors.consent = 'You must agree to the data collection';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ amount, email, name, address, consent });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setAmount(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#FEF7CD] mb-2">{isSubscription ? 'Set Up Monthly Support' : 'Make a Donation'}</h2>
          <p className="text-lg text-[#FEF7CD]">
            Your {isSubscription ? 'monthly' : ''} contribution of {amount.toLocaleString('en-CH', { style: 'currency', currency: 'CHF' })} will help empower youth.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Donation Amount (CHF)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            min="1"
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Complete Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your complete name"
            className="w-full"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Complete Address</Label>
          <Input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Enter your complete address"
            className="w-full"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked as boolean)}
            required
          />
          <Label htmlFor="consent" className="text-sm">
            I agree to the{' '}
            <a href="/terms" className="text-[#1EAEDB] hover:underline">
              Terms & Data Protection Policy
            </a>
            {' '}and consent to the collection and processing of my data for legal purposes.
          </Label>
        </div>
        {errors.consent && <p className="text-red-500 text-sm">{errors.consent}</p>}
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
      >
        {isLoading ? 'Processing...' : 'Proceed to Payment'}
      </Button>
    </form>
  );
};

export default InitialDonationForm; 