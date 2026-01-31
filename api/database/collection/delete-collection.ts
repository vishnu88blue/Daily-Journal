'use client';

import { useMutation } from '@tanstack/react-query';
import { deleteCollection, DeleteCollectionRequest } from '../collections';

export type DeleteCollectionResponse = {};

export function useDeleteCollectionMutation() {
  return useMutation<DeleteCollectionResponse, Error, DeleteCollectionRequest>({
    mutationFn: (request) => deleteCollection(request),
    mutationKey: ['delete-collections'],
  });
}
