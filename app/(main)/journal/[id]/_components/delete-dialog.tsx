'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteJournalEntryMutation } from '@/api/database/journal/delete-journal-entry';

export default function DeleteDialog({ entryId }: { entryId: string }) {
  const router = useRouter();

  // Use stats
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  // API call
  const deleteJournalEntryMutation = useDeleteJournalEntryMutation();

  useEffect(() => {
    if (
      deleteJournalEntryMutation.data &&
      !deleteJournalEntryMutation.isPending
    ) {
      // eslint-disable-next-line
      setDeleteDialogOpen((prev) => (prev ? false : prev));

      toast.success('Journal entry deleted successfully');
      router.push(
        `/collection/${
          deleteJournalEntryMutation.data.collectionId
            ? deleteJournalEntryMutation.data.collectionId
            : 'unorganized'
        }`,
      );
    } else if (deleteJournalEntryMutation.error) {
      toast.error(
        `Error deleting journal entry: ${deleteJournalEntryMutation.error.message}`,
      );
    }
  }, [deleteJournalEntryMutation.isPending]);

  const handleDelete = async () => {
    deleteJournalEntryMutation.mutate({ id: entryId });
  };

  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            journal entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={deleteJournalEntryMutation.isPending}
          >
            {deleteJournalEntryMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
