import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './/ui/dialog';
import { Button } from './ui/button';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ResultDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  variant?: 'success' | 'error' | 'info';
  buttonText?: string;
};

export const ResultDialog: React.FC<ResultDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  variant = 'success',
  buttonText = 'Done',
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle2 className="h-8 w-8 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-600" />;
      default:
        return <Info className="h-8 w-8 text-blue-600" />;
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div
            className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${getIconBg()}`}
          >
            {getIcon()}
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button
            onClick={() => onOpenChange(false)}
            className="min-w-[120px]"
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};