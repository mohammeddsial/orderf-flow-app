import React, { useState } from 'react';
import type { RestaurantTenant } from '@multi-restaurant/database';
import { api } from '../lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (restaurant: RestaurantTenant) => void;
};

// "Add restaurant" — just a name. On save the caller switches to it and opens
// the Menu list; branding is set afterwards in Restaurant Settings.
export function CreateRestaurantDialog({ open, onOpenChange, onCreated }: Props) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const created = await api.createRestaurant({ name: name.trim() });
      onOpenChange(false);
      setName('');
      onCreated(created);
    } catch {
      setError('Could not reach the backend on :4000');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setName('');
          setError(null);
        }
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a restaurant</DialogTitle>
          <DialogDescription>Name it now — you’ll add the menu, then set the brand.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5 py-2">
          <Label>Restaurant name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sunset Tacos"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
