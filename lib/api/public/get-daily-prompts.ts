'use client';

import { useQuery } from '@tanstack/react-query';

export type Quote = {
  id: number;
  text: string;
  author: string;
  author_id: string;
  tags: string[];
};

export type QuoteResponse = Quote;

export async function fetchTodayQuotes(): Promise<QuoteResponse> {
  const res = await fetch('https://thequoteshub.com/api/');

  if (!res.ok) {
    throw new Error('Failed to fetch quotes');
  }

  return res.json();
}

export function useQuoteQuery() {
  return useQuery<QuoteResponse>({
    queryKey: ['today-quotes'],
    queryFn: () => fetchTodayQuotes(),
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
