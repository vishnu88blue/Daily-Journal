'use client';

import { useMutation } from '@tanstack/react-query';
import {
  createJournalEntry,
  CreateJournalEntryRequest,
} from '../create-journal-entry';

export type CreateJournalEntryResponse = {
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

export function useCreateJournalEntryMutation() {
  return useMutation<
    CreateJournalEntryResponse,
    Error,
    CreateJournalEntryRequest
  >({
    mutationFn: (request) => createJournalEntry(request),
    mutationKey: ['create-journal-entry'],
  });
}
