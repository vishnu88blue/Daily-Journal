'use client';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import EditButton from './_components/edit-button';
import { getMoodById } from '@/assets/data/Moods';
import DeleteDialog from './_components/delete-dialog';
import { useGetJournalEntryQuery } from '@/api/database/journal/get-journal-entry';

export default async function JournalEntryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // API call
  const journalEntry = useGetJournalEntryQuery({ id });

  const mood = getMoodById(journalEntry?.data?.mood ?? '');
  return (
    <>
      {/* Header with Mood Image */}
      {journalEntry?.data?.moodImageUrl && (
        <div className="relative h-48 md:h-64 w-full">
          <Image
            src={journalEntry.data.moodImageUrl}
            alt="Mood visualization"
            className="object-contain"
            fill
            priority
          />
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-5xl font-bold gradient-title">
                  {journalEntry?.data?.title}
                </h1>
              </div>
              <p className="text-gray-500">
                Created{' '}
                {format(new Date(journalEntry?.data?.createdAt ?? ''), 'PPP')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <EditButton entryId={id} />
              <DeleteDialog entryId={id} />
            </div>
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2">
            {journalEntry?.data?.collection && (
              <Link href={`/collection/${journalEntry.data.collection.id}`}>
                <Badge>Collection: {journalEntry.data.collection.name}</Badge>
              </Link>
            )}
            <Badge
              variant="outline"
              style={{
                backgroundColor: `var(--${mood?.color}-50)`,
                color: `var(--${mood?.color}-700)`,
                borderColor: `var(--${mood?.color}-200)`,
              }}
            >
              Feeling {mood?.label}
            </Badge>
          </div>
        </div>

        <hr />

        {/* Content Section */}
        <div className="ql-snow">
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{
              __html: journalEntry?.data?.content ?? '',
            }}
          />
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500 pt-4 border-t">
          Last updated{' '}
          {format(new Date(journalEntry?.data?.updatedAt ?? ''), "PPP 'at' p")}
        </div>
      </div>
    </>
  );
}
