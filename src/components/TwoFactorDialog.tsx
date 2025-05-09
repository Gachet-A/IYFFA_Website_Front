import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface TwoFactorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  isVerifying: boolean;
}

export const TwoFactorDialog = ({ isOpen, onClose, onVerify, isVerifying }: TwoFactorDialogProps) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otp);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1F2C] border-[#1EAEDB]/20">
        <DialogHeader>
          <DialogTitle className="text-[#1EAEDB]">Verify 2FA Setup</DialogTitle>
          <DialogDescription className="text-[#FEF7CD]">
            Please enter the verification code sent to your email to complete the 2FA setup.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter verification code"
            className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
            maxLength={6}
            required
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#1EAEDB]/20 text-[#1EAEDB] hover:bg-[#1EAEDB]/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 