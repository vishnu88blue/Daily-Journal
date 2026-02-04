'use client';

import { useMutation } from '@tanstack/react-query';
import { saveDraft, SaveDraftRequest } from '../create-journal-entry';

export type CreateJournalEntryResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  title: string | null;
  content: string | null;
  mood: string | null;
};

export function useSaveDraftMutation() {
  return useMutation<CreateJournalEntryResponse, Error, SaveDraftRequest>({
    mutationFn: (request) => saveDraft(request),
    mutationKey: ['save-draft'],
  });
}
