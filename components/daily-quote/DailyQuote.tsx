'use client';

import { useQuoteQuery } from '@/lib/api/public/get-daily-prompts';
import { Skeleton } from '../ui/skeleton';

const DailyQuote = () => {
  const quoteQuery = useQuoteQuery();
  const dailyAdvice = quoteQuery.data?.text
    ? quoteQuery.data.text
    : ' My Thoughts Today';
  return (
    <div className="space-y-4 p-4">
      <h3 className="text-xl font-semibold text-orange-900">
        {dailyAdvice ? dailyAdvice : 'My Thoughts Today'}
      </h3>
      <Skeleton className="h-4 bg-orange-100 rounded w-3/4" />
      <Skeleton className="h-4 bg-orange-100 rounded w-full" />
      <Skeleton className="h-4 bg-orange-100 rounded w-2/3" />
    </div>
  );
};

export default DailyQuote;
