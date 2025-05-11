import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const POLL_INTERVAL = 2000; // 2 seconds
const MAX_POLLS = 15; // 30 seconds total

const PaymentResult = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const pollCount = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const payment_intent = query.get('payment_intent');
    if (!payment_intent) {
      setStatus('error');
      setError('No payment intent found in URL.');
      return;
    }

    const pollStatus = () => {
      axios.get(`/api/payment-status/?payment_intent=${payment_intent}`)
        .then(res => {
          const paymentStatus = res.data.status;
          if (paymentStatus === 'succeeded') {
            setStatus('success');
            setTimeout(() => navigate('/thank-you'), 1000);
          } else if (paymentStatus === 'failed' || paymentStatus === 'canceled') {
            setStatus('error');
            setError('Payment was not successful.');
          } else if (paymentStatus === 'processing' || paymentStatus === 'pending') {
            // Keep polling
            if (pollCount.current < MAX_POLLS) {
              pollCount.current += 1;
              timeoutRef.current = setTimeout(pollStatus, POLL_INTERVAL);
            } else {
              setStatus('error');
              setError('Payment is still processing. Please check your email or try again later.');
            }
          } else {
            // Unknown status, keep polling
            if (pollCount.current < MAX_POLLS) {
              pollCount.current += 1;
              timeoutRef.current = setTimeout(pollStatus, POLL_INTERVAL);
            } else {
              setStatus('error');
              setError('Unable to confirm payment status. Please check your email or try again later.');
            }
          }
        })
        .catch(() => {
          // If not found, keep polling
          if (pollCount.current < MAX_POLLS) {
            pollCount.current += 1;
            timeoutRef.current = setTimeout(pollStatus, POLL_INTERVAL);
          } else {
            setStatus('error');
            setError('Failed to verify payment status.');
          }
        });
    };

    pollStatus();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-lg">Verifying your payment...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-red-600">Payment Failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg">{error}</p>
              <button onClick={() => navigate('/one-time-gift')} className="bg-[#1EAEDB] text-white px-4 py-2 rounded">Try Again</button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If status is success, show nothing (redirecting)
  return null;
};

export default PaymentResult; 