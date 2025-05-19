import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/input';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

interface SearchInputProps extends Omit<TextInputProps, 'onChange'> {
  timeout?: number;
  onChange: (value: string) => void;
  initialValue?: string;
  icon?: React.ReactNode;
}

export function SearchInput({
  timeout = 500,
  onChange,
  initialValue = '',
  className,
  icon,
  ...props
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(initialValue);
  // const [debouncedValue] = useDebounce(searchValue, timeout);

  // useEffect(() => {
  //   onChange(debouncedValue);
  // }, [debouncedValue]);

  const handleChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          className={
            className + ' bg-grey-50 dark:bg-grey-700 peer pe-9 ps-9 w-full'
          }
          value={searchValue}
          onChange={(e) => handleChange(e.target.value)}
          {...props}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          {icon ? icon : <SearchIcon className="h-5 w-5" />}
        </div>
      </div>
    </div>
  );
}
