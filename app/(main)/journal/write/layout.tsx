import { ReactNode, Suspense } from 'react';
import { BarLoader } from 'react-spinners';
import BackButton from '../[id]/_components/BackButton';

export default function WriteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-1">
      <BackButton customRoute="/dashboard" />
      <Suspense fallback={<BarLoader color="orange" width={'100%'} />}>
        {children}
      </Suspense>
    </div>
  );
}
