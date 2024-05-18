import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

export function TextUpdaterNode({ data }: { data: any }) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div>
      <Handle type="target" position={Position.Top}/>
      <div className='bg-card border rounded-lg p-2 hover:border-purple-600 focus:border-purple-600'>
        <label htmlFor="text" className=' text-card-foreground'>{data.label}</label>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}
