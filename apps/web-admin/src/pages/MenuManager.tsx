import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useRestaurant } from '../context/RestaurantContext';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Textarea } from '../components/ui/textarea';
import { Plus, Pencil, Trash2, Upload, Download, ImagePlus } from 'lucide-react';
import Papa from 'papaparse';
import { Badge } from '../components/ui/badge';
import { PageHero } from '../components/admin-ui';
import { ResultDialog } from '../components/ResultDialog';
import { getPlaceholderImage } from '@multi-restaurant/database';

export const MenuManager = () => {
  const { currentId } = useRestaurant();
  const [items, setItems] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    basePrice: 0,
    category: 'Burgers',
    imageUrl: '',
    calories: 0,
    isAvailable: true,
    modifiers: '[]',
  });

  const [importResult, setImportResult] = useState<{
    open: boolean;
    title: string;
    description: string;
    variant: 'success' | 'error' | 'info';
  }>({
    open: false,
    title: '',
    description: '',
    variant: 'success',
  });

  const refresh = () => {
    if (!currentId) return;
    api.getMenuItems(currentId).then(setItems).catch(() => {});
  };

  const imageUrl = form.imageUrl || getPlaceholderImage(form.title || 'default');

  useEffect(() => {
    refresh();
  }, [currentId]);

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      basePrice: 0,
      category: 'Burgers',
      imageUrl: '',
      calories: 0,
      isAvailable: true,
      modifiers: '[]',
    });
    setEditingId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const saveItem = async () => {
    const payload = {
      restaurantId: currentId,  // <-- ADD THIS
      title: form.title,
      description: form.description,
      basePrice: parseFloat(form.basePrice as any),
      category: form.category as any,
      imageUrl: form.imageUrl,
      calories: parseInt(form.calories as any),
      isAvailable: form.isAvailable,
      modifiers: JSON.parse(form.modifiers),
    };
  
    if (!currentId) return;
    try {
      if (editingId) {
        await api.updateMenuItem(editingId, payload);
      } else {
        await api.createMenuItem(currentId, payload);
      }
      refresh();
      resetForm();
      setDialogOpen(false);
    } catch {
      alert('Could not reach the backend on :4000');
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.deleteMenuItem(id);
      refresh();
    } catch {
      alert('Could not reach the backend on :4000');
    }
  };

  const editItem = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      basePrice: item.basePrice,
      category: item.category,
      imageUrl: item.imageUrl,
      calories: item.calories,
      isAvailable: item.isAvailable,
      modifiers: JSON.stringify(item.modifiers),
    });
    setDialogOpen(true);
  };

// CSV Import
const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  Papa.parse(file, {
    header: true,
    complete: async (result) => {
      const rows = result.data as any[];
      if (!currentId) return;

      let successCount = 0;
      let errorCount = 0;

      for (const row of rows) {
        // 1. Skip rows with missing title
        if (!row.title || row.title.trim() === '') {
          errorCount++;
          console.warn('Skipping row: missing title', row);
          continue;
        }
      
        // 2. Safely parse modifiers (JSON)
        let modifiers = [];
        try {
          modifiers = row.modifiers ? JSON.parse(row.modifiers) : [];
        } catch (err) {
          console.warn('Invalid modifiers JSON, using empty array', row);
          modifiers = [];
        }
      
        const payload = {
          restaurantId: currentId,  // <-- ADD THIS
          title: row.title.trim(),
          description: row.description?.trim() || '',
          basePrice: parseFloat(row.basePrice) || 0,
          category: row.category?.trim() || 'Burgers',
          imageUrl: row.imageUrl?.trim() || '',
          calories: parseInt(row.calories) || 0,
          isAvailable: row.isAvailable?.toLowerCase() === 'true',
          modifiers,
        };
      
        try {
          await api.createMenuItem(currentId, payload);
          successCount++;
        } catch (err) {
          console.error('Failed to import row:', row, err);
          errorCount++;
          // Do not break – continue with the next row
        }
      }

      refresh();

      // Show modal instead of alert
      if (errorCount === 0) {
        setImportResult({
          open: true,
          title: '✅ Import Successful',
          description: `Successfully imported ${successCount} item${successCount > 1 ? 's' : ''}.`,
          variant: 'success',
        });
      } else {
        setImportResult({
          open: true,
          title: '⚠️ Import Completed with Errors',
          description: `Imported ${successCount} item${successCount > 1 ? 's' : ''}. ${errorCount} item${errorCount > 1 ? 's' : ''} failed. Check console for details.`,
          variant: 'error',
        });
      }
    },
  });
};

  // CSV Export
  const exportCSV = () => {
    const data = items.map(({ modifiers, ...rest }) => ({
      ...rest,
      modifiers: JSON.stringify(modifiers),
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu.csv';
    a.click();
  };

  return (
    <Layout title="Menu Manager" breadcrumb="Menu Manager" searchPlaceholder="Search menu items...">
      <div className="space-y-6">
        <PageHero
          title="Menu Manager"
          subtitle="Manage your restaurant menu items"
          actions={
            <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Label className="cursor-pointer">
              <Button variant="outline" className="gap-2" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  Import CSV
                </span>
              </Button>
              <Input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
            </Label>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                  <DialogDescription>Fill in the details for the menu item.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={form.title}
                        onChange={(e) => setForm({...form, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={form.description}
                        onChange={(e) => setForm({...form, description: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={form.basePrice}
                        onChange={(e) => setForm({...form, basePrice: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={form.category}
                        onValueChange={(v) => setForm({...form, category: v})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Burgers">Burgers</SelectItem>
                          <SelectItem value="Sides">Sides</SelectItem>
                          <SelectItem value="Drinks">Drinks</SelectItem>
                          <SelectItem value="Desserts">Desserts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Calories</Label>
                      <Input
                        type="number"
                        value={form.calories}
                        onChange={(e) => setForm({...form, calories: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2 flex items-end">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={form.isAvailable}
                          onCheckedChange={(v) => setForm({...form, isAvailable: v})}
                        />
                        <Label>Available</Label>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Image</Label>
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-lg border border-dashed flex items-center justify-center overflow-hidden bg-muted/30">
                          {form.imageUrl ? (
                            <img src={form.imageUrl} alt="preview" className="h-full w-full object-cover" />
                          ) : (
                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-auto"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Modifiers (JSON)</Label>
                      <Textarea
                        rows={3}
                        value={form.modifiers}
                        onChange={(e) => setForm({...form, modifiers: e.target.value})}
                        placeholder='[{"id":"mod-size","name":"Size","maxSelection":1,"options":[{"name":"Regular","price":0}]}]'
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { resetForm(); setDialogOpen(false); }}>Cancel</Button>
                  <Button onClick={saveItem}>{editingId ? 'Update' : 'Add'} Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
          }
        />

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>${item.basePrice.toFixed(2)}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Badge variant={item.isAvailable ? 'default' : 'destructive'}>
                        {item.isAvailable ? 'Available' : 'Sold Out'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => editItem(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No menu items yet. Add your first item!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>
      </div>
      {/* PageHero, buttons, table... */}
      {/* Import Result Dialog */}
<ResultDialog
  open={importResult.open}
  onOpenChange={(open) => setImportResult((prev) => ({ ...prev, open }))}
  title={importResult.title}
  description={importResult.description}
  variant={importResult.variant}
  buttonText="Done"
/>
    </Layout>
  );
};