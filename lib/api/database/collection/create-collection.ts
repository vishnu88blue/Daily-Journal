'use client';

import { useMutation } from '@tanstack/react-query';
import { createCollectionFn, CreateCollectionRequest } from '../collections';

export type CreateCollectionResponse = {
  userId: string;
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
};

export function useCreateCollectionMutation() {
  return useMutation<CreateCollectionResponse, Error, CreateCollectionRequest>({
    mutationFn: (request) => createCollectionFn(request),
    mutationKey: ['collections'],
  });
}
