'use client';

import { useQuery } from '@tanstack/react-query';
import { getCollections } from '../collections';

export type getCollectionResponse = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  userId: string;
};

export function getCollectionQuery() {
  return useQuery<getCollectionResponse[]>({
    queryKey: ['get-collections'],
    queryFn: () => getCollections(),
  });
}
