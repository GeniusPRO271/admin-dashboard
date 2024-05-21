import { GetRoles, Role, getUsers } from '@/lib/db';
import { UsersTable } from './users-table';
import { Search } from './search';
import { Button } from '@/components/ui/button';
import CreateFormView from './create-form';
import { auth } from 'app/api/auth/[...nextauth]';


export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { users, newOffset } = await getUsers(search, Number(offset));
  const roles: Role[] = await GetRoles();
  const session = await auth();
  const currentUser = session?.user;

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <CreateFormView />
      <div className="w-full mb-4">
        <Search value={searchParams.q} route="" />
      </div>
      {currentUser && (
        <UsersTable
          users={users}
          offset={newOffset}
          roles={roles}
          currentUser={currentUser}
        />
      )}
    </main>
  );
}
