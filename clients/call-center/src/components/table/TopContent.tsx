export interface TopContentProps {
  total: number;
}

export function TopContent({ total }: TopContentProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-default-400 text-small">Total {total}</span>
      <label className="flex items-center text-default-400 text-small">
        Rows per page:
        <select className="bg-transparent outline-none text-default-400 text-small" value="10">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </label>
    </div>
  );
}
