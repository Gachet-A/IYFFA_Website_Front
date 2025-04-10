import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Thank You for Your Support!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg">
              We are grateful for your generous donation. Your support helps us continue our mission of empowering youth.
            </p>
            <p className="text-lg">
              An email has been sent to your email address with the details of your donation.
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => navigate('/donations')}
              className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
            >
              Return to Donations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 