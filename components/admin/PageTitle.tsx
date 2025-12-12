
'use client';

import { useSearchParams } from 'next/navigation';

export function PageTitle() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const pageTitle = page ? page.charAt(0).toUpperCase() + page.slice(1) : 'Dashboard';
  return <h1 className="text-lg font-semibold md:text-xl font-serif">{pageTitle}</h1>;
}
