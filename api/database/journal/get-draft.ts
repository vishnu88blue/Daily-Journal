'use client';

import { useQuery } from '@tanstack/react-query';
import { getDraft } from '../create-journal-entry';

export type GetJournalEntryResponse = {
  userId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string | null;
  content: string | null;
  mood: string | null;
};

export function getJournalDraftQuery(enabled?: boolean) {
  return useQuery<GetJournalEntryResponse | null>({
    queryFn: () => getDraft(),
    queryKey: ['get-journal-entry'],
    enabled: enabled ?? true,
  });
}
