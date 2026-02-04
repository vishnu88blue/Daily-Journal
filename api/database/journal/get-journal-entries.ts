'use client';

import { useQuery } from '@tanstack/react-query';
import { getJournalEntries } from '../create-journal-entry';
import { MoodType } from '@/assets/data/Moods';

export type GetJournalEntriesRequest = {
  collectionId?: string;
  orderBy?: 'asc' | 'desc';
};

export type GetJournalEntriesResponse = {
  moodData: MoodType | undefined;
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

export function useGetJournalEntriesQuery(request: GetJournalEntriesRequest) {
  return useQuery<GetJournalEntriesResponse[]>({
    queryFn: () => getJournalEntries(request),
    queryKey: ['get-journal-entries'],
  });
}
