import { User } from 'app/dashboard/user';
import { DiagramIcon, LockIcon, Logo, SettingsIcon, SquareIcon, UsersIcon } from '@/components/icons';
import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link';
import { NavItem } from 'app/dashboard/nav-item';
import { Lock, Square, Users, Workflow } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section>
        <div className="grid min-h-screen w-full lg:grid-cols-[80px_1fr]">
          <div className=" border-r border-border lg:block bg-background">
            <div className="flex w-full h-full max-h-screen flex-col gap-2">
              <div className="flex h-20 w-full justify-center items-center border-b">
                <Link
                  className="flex gap-2 font-semibold"
                  href="/"
                >
                  <Logo />
                </Link>
              </div>
              <div className="flex w-full justify-center items-center overflow-auto py-2">
                <nav className="grid items-start text-sm font-medium text-foreground">
                  <NavItem href="/dashboard">
                    <Users className="h-5 w-5" />
                  </NavItem>
                  <NavItem href="/dashboard/devices">
                    <Lock className="h-5 w-5" />
                  </NavItem>
                  <NavItem href="/dashboard/spaces">
                    <Square className="h-5 w-5" />
                  </NavItem>
                  <NavItem href="/dashboard/board">
                    <Workflow className="h-5 w-5 text-foreground" />
                  </NavItem>
                  <NavItem href="/dashboard/settings">
                    <SettingsIcon className="h-5 w-5 text-foreground" />
                  </NavItem>
                </nav>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-20 lg:h-20 items-center gap-4 border-b bg-background px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
              <Link
                className="flex items-center gap-2 font-semibold lg:hidden"
                href="/dashboard"
              >
                <Logo />
                <span className="">ACME</span>
              </Link>
              <User />
            </header>
            {children}
          </div>
        </div>
        <Analytics />
      </section>
    </>
  );
}
