'use client';
import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BackButton = ({ customRoute }: { customRoute?: string }) => {
  const router = useRouter();
  return (
    <div className="mb-8">
      <span
        onClick={() => (customRoute ? router.push(customRoute) : router.back())}
        className="inline-flex items-center gap-2 cursor-pointer text-sm text-orange-600 hover:text-orange-700 hover:underline "
      >
        <MoveLeft />
        Back
      </span>
    </div>
  );
};

export default BackButton;
