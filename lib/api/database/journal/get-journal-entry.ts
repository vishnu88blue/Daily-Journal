'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getJournalEntry,
  GetJournalEntryRequest,
} from '../create-journal-entry';

export type GetJournalEntryResponse = {
  collection: {
    name: string;
    id: string;
  } | null;
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

export function useGetJournalEntryQuery(
  request: GetJournalEntryRequest,
  enabled?: boolean,
) {
  return useQuery<GetJournalEntryResponse>({
    queryFn: () => getJournalEntry(request),
    queryKey: ['get-journal-entry'],
    enabled: enabled ?? true,
  });
}
