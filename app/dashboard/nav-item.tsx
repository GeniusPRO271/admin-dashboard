'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavItem({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-3 rounded-lg p-4 text-foreground  transition-all hover:bg-card-hover',
        {
          ' bg-gray-600': pathname === href
        }
      )}
    >
      {children}
    </Link>
  );
}
