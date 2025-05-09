import { ImageIcon } from 'lucide-react';
import type React from 'react';

interface DataTableNoResultsProps {
  children?: React.ReactNode;
}

export function DataTableNoResults({ children }: DataTableNoResultsProps) {
  return (
    <div className="flex h-[400px] flex-col items-center justify-center space-y-3 py-12">
      {children || (
        <>
          <div className="rounded-full bg-muted p-3">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="text-xl font-medium">No results found</div>
          <div className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </div>
        </>
      )}
    </div>
  );
}
