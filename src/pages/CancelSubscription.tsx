import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function CancelSubscription() {
  const { subscriptionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const { getToken } = useAuth();

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) {
        toast({
          title: "Error",
          description: "You must be logged in to cancel a subscription",
          variant: "destructive"
        });
        return;
      }
      
      // First, find the payment record associated with this subscription ID
      const paymentResponse = await axios.get(
        `http://localhost:8000/api/payments/?subscription_id=${subscriptionId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Payment response:', paymentResponse.data);
      
      if (!paymentResponse.data || paymentResponse.data.length === 0) {
        toast({
          title: "Error",
          description: "No payment record found for this subscription",
          variant: "destructive"
        });
        return;
      }
      
      const paymentId = paymentResponse.data[0].id;
      console.log('Payment ID:', paymentId);
      
      // Now cancel the subscription using the payment ID
      const response = await axios.post(
        `http://localhost:8000/api/cancel_subscription/${paymentId}/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.status === 'success') {
        setIsCancelled(true);
        toast({
          title: "Success",
          description: "Your subscription has been cancelled. It will remain active until the end of the current billing period.",
          variant: "default"
        });
      }
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || 'Failed to cancel subscription. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Cancel Subscription</CardTitle>
          <CardDescription className="text-center">
            {isCancelled 
              ? "Your subscription has been cancelled. It will remain active until the end of the current billing period."
              : "Are you sure you want to cancel your subscription?"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {!isCancelled && (
            <p className="mb-4">
              Your monthly support helps us continue our mission. If you cancel, your subscription will remain active until the end of the current billing period.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          {!isCancelled ? (
            <>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                disabled={isLoading}
              >
                Go Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading ? "Cancelling..." : "Cancel Subscription"}
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 