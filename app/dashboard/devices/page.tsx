import { getDevices, getSpaces, getSpacesFlow } from '@/lib/db';
import { Search } from '../search';
import { DevicesTable } from './devices-table';
import { Button } from '@/components/ui/button';
import { devicesSync } from 'app/actions';

export default async function DevicePage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { devices, newOffset } = await getDevices(search, Number(offset));
  const {spaces} = await getSpaces("", 0);
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl w-full">Devices</h1>
      </div>
      <div className="w-full mb-4">
        <Search value={searchParams.q} placeholder='search devices...' route='devices'/>
      </div>
      <DevicesTable devices={devices} offset={newOffset} spaces={spaces} />
    </main>
  );
}
