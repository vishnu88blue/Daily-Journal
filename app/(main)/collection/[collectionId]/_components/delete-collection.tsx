'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { getCollectionResponse } from '@/api/database/collection/get-collection';
import { useDeleteCollectionMutation } from '@/api/database/collection/delete-collection';

export default function DeleteCollectionDialog({
  collection,
  entriesCount = 0,
}: {
  collection: getCollectionResponse;
  entriesCount: number;
}) {
  // Hooks
  const router = useRouter();

  // Use States
  const [open, setOpen] = useState<boolean>(false);

  // API Call
  const deleteMutation = useDeleteCollectionMutation();

  useEffect(() => {
    if (deleteMutation.data && !deleteMutation.isPending) {
      setOpen(false);
      toast.success(
        `Collection "${collection?.name}" and all its entries deleted`,
      );
      router.push('/dashboard');
    } else if (deleteMutation.isError) {
      toast.error(
        `Failed to delete collection "${collection?.name}": ${deleteMutation.error.message}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteMutation.isPending]);

  const handleDelete = async () => {
    deleteMutation.mutate({ id: collection.id });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete &quot;{collection?.name}&quot;?
          </AlertDialogTitle>
          <div className="space-y-2 text-muted-foreground text-sm">
            {/* fixing hydration errors */}
            <p>This will permanently delete:</p>
            <ul className="list-disc list-inside">
              <li>The collection &quot;{collection?.name}&quot;</li>
              <li>
                {entriesCount} journal{' '}
                {entriesCount === 1 ? 'entry' : 'entries'}
              </li>
            </ul>
            <p className="font-semibold text-red-600">
              This action cannot be undone.
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Collection'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
