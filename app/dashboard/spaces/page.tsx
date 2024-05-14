import { getSpaces, getSpacesFlow } from '@/lib/db';
import { Search } from '../search';
import { SpaceTable } from './space-table';
import CreateSpaceFormView from './create-form-space';

export default async function SpacePage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { spaces, newOffset } = await getSpaces(search, Number(offset));
  const { spaces: dropdownSpaces} = await getSpaces("", 0);

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 ">
      <CreateSpaceFormView  dropdownSpaces={dropdownSpaces}/>
      <div className="w-full mb-4">
        <Search
          value={searchParams.q}
          placeholder="search spaces..."
          route="spaces"
        />
      </div>
      <SpaceTable
        spaces={spaces}
        offset={newOffset}
        dropdownSpaces={dropdownSpaces}
      />
    </main>
  );
}
