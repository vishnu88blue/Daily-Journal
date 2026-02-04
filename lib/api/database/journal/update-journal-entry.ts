'use client';

import { useMutation } from '@tanstack/react-query';
import {
  UpdateJournalEntryRequest,
  updateJournalEntry,
} from '../create-journal-entry';

export type UpdateJournalEntryResponse = {
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

export function useUpdateJournalEntryMutation() {
  return useMutation<
    UpdateJournalEntryResponse,
    Error,
    UpdateJournalEntryRequest
  >({
    mutationFn: (request) => updateJournalEntry(request),
    mutationKey: ['update-journal-entry'],
  });
}
