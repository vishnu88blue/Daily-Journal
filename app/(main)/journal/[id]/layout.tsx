import Link from 'next/link';
import { ReactNode, Suspense } from 'react';
import Loading from './loading';
import BackButton from './_components/BackButton';

export default function EntryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-8">
      <BackButton />
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
}
