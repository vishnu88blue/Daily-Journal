'use client';

import { useQuery } from '@tanstack/react-query';
import { AnalyticsRequest, getAnalytics } from '../analyitcs';

export type JournalAnalyticsResponse = {
  timeline: {
    date: string;
    averageScore: number;
    entryCount: number;
  }[];
  stats: {
    totalEntries: number;
    averageScore: number;
    mostFrequentMood: string;
    dailyAverage: number;
  };
  entries: {
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
  }[];
};

export type JournalAnalyticsApiResponse = {
  data: JournalAnalyticsResponse;
};

export function getAnalyticsQuery(
  request: AnalyticsRequest,
  valueToFocus?: string,
) {
  return useQuery<JournalAnalyticsApiResponse>({
    queryFn: () => getAnalytics(request),
    queryKey: ['get-analytics', valueToFocus],
  });
}
