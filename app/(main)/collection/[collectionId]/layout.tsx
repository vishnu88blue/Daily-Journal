import { ReactNode, Suspense } from 'react';
import BackButton from '../../journal/[id]/_components/BackButton';
import Loading from '../../journal/[id]/loading';

export default function CollectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="px-4 py-8">
      <BackButton />
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
}
