import React from 'react';

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

function Table<T,>({ columns, data }: TableProps<T>) {
  return (
    <div className="overflow-x-auto bg-surface border border-surface2 rounded-2xl">
      <table className="w-full text-left">
        <thead className="sticky top-0 bg-surface2">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={`p-4 text-sm font-semibold text-primary-muted ${col.className}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="border-t border-surface2 hover:bg-surface2/50">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`p-4 text-sm ${col.className}`}>
                  {col.accessor(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
