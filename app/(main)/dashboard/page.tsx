'use client';
import Collections from './_components/collections';
import MoodAnalytics from './_components/mood-analytics';
import {
  GetJournalEntriesResponse,
  useGetJournalEntriesQuery,
} from '@/lib/api/database/journal/get-journal-entries';

const Dashboard = () => {
  const { data: getJournalEntriesData } = useGetJournalEntriesQuery({});

  // Group entries by collection
  const entriesByCollection = getJournalEntriesData?.reduce<
    Record<string, GetJournalEntriesResponse[]>
  >((acc, entry) => {
    const collectionId = entry.collectionId || 'unorganized';
    if (!acc[collectionId]) {
      acc[collectionId] = [];
    }
    acc[collectionId].push(entry);
    return acc;
  }, {});

  return (
    <div className="px-4 py-8 space-y-8">
      {/* Analytics Section */}
      <section className="space-y-4">
        <MoodAnalytics />
      </section>
      <Collections entriesByCollection={entriesByCollection} />
    </div>
  );
};

export default Dashboard;
