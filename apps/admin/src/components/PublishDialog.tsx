import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  successTitle?: string;
  successText?: string;
  onConfirm: () => Promise<void>;
};

type Status = 'confirm' | 'saving' | 'success' | 'error';

// Confirm -> save -> success/error flow in a single modal, replacing native alert().
export function PublishDialog({
  open,
  onOpenChange,
  title = 'Publish changes?',
  description = 'Updates go live immediately across all touchpoints.',
  confirmLabel = 'Approve & Publish',
  successTitle = 'Changes published',
  successText = 'Your updates are now live.',
  onConfirm,
}: Props) {
  const [status, setStatus] = useState<Status>('confirm');

  const close = () => {
    onOpenChange(false);
    // reset after the close animation so it reopens on the confirm step
    setTimeout(() => setStatus('confirm'), 200);
  };

  const handleConfirm = async () => {
    setStatus('saving');
    try {
      await onConfirm();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? close() : onOpenChange(true))}>
      <DialogContent className="sm:max-w-md">
        {status === 'success' && (
          <>
            <DialogHeader>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <DialogTitle className="text-center">{successTitle}</DialogTitle>
              <DialogDescription className="text-center">{successText}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button onClick={close}>Done</Button>
            </DialogFooter>
          </>
        )}

        {status === 'error' && (
          <>
            <DialogHeader>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-7 w-7 text-red-600" />
              </div>
              <DialogTitle className="text-center">Couldn’t publish</DialogTitle>
              <DialogDescription className="text-center">
                Could not reach the backend on :4000. Is the API running?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button variant="outline" onClick={() => setStatus('confirm')}>
                Try again
              </Button>
              <Button onClick={close}>Close</Button>
            </DialogFooter>
          </>
        )}

        {(status === 'confirm' || status === 'saving') && (
          <>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={close} disabled={status === 'saving'}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={status === 'saving'} className="gap-2">
                {status === 'saving' ? 'Publishing…' : confirmLabel}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
