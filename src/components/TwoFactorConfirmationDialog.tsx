import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface TwoFactorConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isEnabling: boolean;
  isDisabling: boolean;
  action: 'enable' | 'disable';
}

export const TwoFactorConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isEnabling,
  isDisabling,
  action,
}: TwoFactorConfirmationDialogProps) => {
  const isLoading = isEnabling || isDisabling;
  const isEnable = action === 'enable';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1F2C] border-[#1EAEDB]/20">
        <DialogHeader>
          <DialogTitle className="text-[#1EAEDB]">
            {isEnable ? 'Enable Two-Factor Authentication' : 'Disable Two-Factor Authentication'}
          </DialogTitle>
          <DialogDescription className="text-[#FEF7CD]">
            {isEnable
              ? 'Are you sure you want to enable two-factor authentication? You will need to verify your email each time you log in.'
              : 'Are you sure you want to disable two-factor authentication? This will make your account less secure.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-[#1EAEDB]/20 text-[#1EAEDB] hover:bg-[#1EAEDB]/10"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className={`${isEnable ? 'bg-[#1EAEDB] hover:bg-[#1EAEDB]/90' : 'bg-red-500 hover:bg-red-600'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEnable ? 'Enabling...' : 'Disabling...'}
              </>
            ) : (
              isEnable ? 'Enable' : 'Disable'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 