import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" />
      
      {/* Modal */}
      <div className="relative z-50 w-full max-w-md rounded-lg bg-[#1A1F2C] border border-[#1EAEDB]/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#1EAEDB]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#1EAEDB]/10 transition-colors"
          >
            <X className="w-5 h-5 text-[#1EAEDB]" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>
      </div>
    </div>
  );
} 