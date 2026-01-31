'use client';

import { getJournalEntries } from '@/api/database/create-journal-entry';
import DeleteCollectionDialog from './_components/delete-collection';
import { JournalFilters } from './_components/journal-filters';
import { getCollectionQuery } from '@/api/database/collection/get-collection';

type CollectionPageProps = {
  params: {
    collectionId: string;
  };
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collectionId } = await params;
  const entries = await getJournalEntries({ collectionId });
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
              entriesCount={entries.data.entries.length}
            />
          )}
        </div>
        {collection?.description && (
          <h2 className="font-extralight pl-1">{collection?.description}</h2>
        )}
      </div>

      {/* Client-side Filters Component */}
      <JournalFilters entries={entries.data.entries} />
    </div>
  );
}
