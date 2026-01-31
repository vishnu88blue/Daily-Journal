'use client';

import { useMutation } from '@tanstack/react-query';
import {
  deleteJournalEntry,
  GetJournalEntryRequest,
} from '../create-journal-entry';

export type DeleteJournalEntryResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  title: string;
  content: string;
  mood: string;
  moodScore: number;
  moodImageUrl: string | null;
  collectionId: string | null;
};

export function useDeleteJournalEntryMutation() {
  return useMutation<DeleteJournalEntryResponse, Error, GetJournalEntryRequest>(
    {
      mutationFn: (request) => deleteJournalEntry(request),
      mutationKey: ['delete-journal-entry'],
    },
  );
}
