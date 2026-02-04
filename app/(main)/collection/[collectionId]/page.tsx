'use client';

import { useParams } from 'next/navigation';
import DeleteCollectionDialog from './_components/delete-collection';
import { JournalFilters } from './_components/journal-filters';
import { getCollectionQuery } from '@/lib/api/database/collection/get-collection';
import { useGetJournalEntriesQuery } from '@/lib/api/database/journal/get-journal-entries';

export default function CollectionPage() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const journalEntriesData = useGetJournalEntriesQuery({ collectionId });
  // API calls
  const collectionsData = getCollectionQuery();

  const collection =
    collectionId !== 'unorganized'
      ? collectionsData?.data?.find((c) => c.id === collectionId)
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold gradient-title">
            {collectionId === 'unorganized'
              ? 'Unorganized Entries'
              : collection?.name || 'Collection'}
          </h1>
          {collection && (
            <DeleteCollectionDialog
              collection={collection}
              entriesCount={
                journalEntriesData?.data ? journalEntriesData?.data.length : 0
              }
            />
          )}
        </div>
        {collection?.description && (
          <h2 className="font-extralight pl-1">{collection?.description}</h2>
        )}
      </div>

      {/* Client-side Filters Component */}
      <JournalFilters entries={journalEntriesData?.data || []} />
    </div>
  );
}
