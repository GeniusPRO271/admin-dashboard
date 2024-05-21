'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Role, SelectUser, UpdateUserRole } from '@/lib/db';
import { useRouter } from 'next/navigation';
import Dropdown from '@/components/ui/dropdown';
import { useState } from 'react';
import { updateUserRole } from 'app/actions';
import { UserIcon } from 'lucide-react';
import { User } from 'next-auth';

export function UsersTable({
  users,
  offset,
  roles,
  currentUser
}: {
  users: SelectUser[];
  offset: number | null;
  roles: Role[];
  currentUser: User;
}) {
  const router = useRouter();

  function onClick() {
    router.replace(`/dashboard?offset=${offset}`);
  }

  return (
    <>
      <form className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Username</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles &&
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  roles={roles}
                  currentUser={currentUser}
                />
              ))}
          </TableBody>
        </Table>
      </form>
      {offset !== null && (
        <Button
          className="mt-4 w-40"
          variant="secondary"
          onClick={() => onClick()}
        >
          Next Page
        </Button>
      )}
    </>
  );
}

function UserRow({
  user,
  roles,
  currentUser
}: {
  user: SelectUser;
  roles: Role[];
  currentUser: User;
}) {
  const userId = user.id;
  const rolesName = roles.map((role) => role.name);
  const [loading, setLoading] = useState<boolean>(false);
  const handleRoleChange = async (e: any) => {
    setLoading(true);
    let roleString = e.target.innerHTML;
    let roleVal = roles.find((role) => role.name == roleString);
    if (roleVal) {
      await updateUserRole(userId, roleVal.ID);
    } else {
      console.log('Error getting rolVal');
    }
    setLoading(false);
  };
  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>
        {user.role == 'Admin' ? (
          user.role
        ) : loading ? (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <Dropdown
            text={user.role}
            items={rolesName}
            onClick={handleRoleChange}
          />
        )}
      </TableCell>
      <TableCell>
        {currentUser.name == user.name ?   <UserIcon className='text-purple-600'/> : <></>}
      </TableCell>
    </TableRow>
  );
}
