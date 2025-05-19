import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { Button } from '../../ui/button';
import { Calendar } from '../../ui/calendar';

// Enum for predefined date ranges to improve type safety
enum DateRangeOption {
  Today = 'today',
  Yesterday = 'yesterday',
  LastTwoDays = 'twodays',
  LastSevenDays = 'sevendays',
  LastOneMonth = 'onemonth',
  LastThreeMonths = 'lastthreemonth',
  Custom = 'customs',
}
// Interface for date option
interface DateOption {
  value: DateRangeOption;
  label: string;
}

type DateRange = {
  from: Date | null;
  to: Date | null;
};

export interface IDateFilter {
  date?: string;
  fromDate?: string;
  toDate?: string;
}

// Interface for component props with improved typing
interface CustomDateSelectorProps {
  options?: DateOption[];
  date: IDateFilter;
  onDateChange: (newDate: IDateFilter) => void;
}

const CustomDateSelector: React.FC<CustomDateSelectorProps> = ({
  options = [
    { value: DateRangeOption.Today, label: 'Today' },
    { value: DateRangeOption.Yesterday, label: 'Yesterday' },
    { value: DateRangeOption.LastTwoDays, label: 'Last 2 days' },
    { value: DateRangeOption.LastSevenDays, label: 'Last 7 days' },
    { value: DateRangeOption.LastOneMonth, label: 'Last 1 Month' },
    { value: DateRangeOption.LastThreeMonths, label: 'Last 3 Months' },
    { value: DateRangeOption.Custom, label: 'customs' },
  ],
  date: currentValue,
  onDateChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState(false);
  const todayDate = new Date();

  const date = {
    from: currentValue?.fromDate,
    to: currentValue?.toDate,
  };

  const setDate = (newDate: DateRange) => {
    onDateChange({
      ...currentValue,
      fromDate: (newDate.from && format(newDate.from, 'yyyy-MM-dd')) || '',
      toDate: (newDate.to && format(newDate.to, 'yyyy-MM-dd')) || '',
    });
  };

  const setSelectedOption = (value: DateRangeOption) => {
    onDateChange({
      ...currentValue,
      date: value,
    });
  };

  // Handle option change with improved logic
  const handleOptionChange = (value: string): void => {
    const rangeOption = value as DateRangeOption;
    if (rangeOption === DateRangeOption.Custom) {
      setShowDatePicker(true);
    } else {
      onDateChange({ ...currentValue, date: rangeOption });
      setShowOptions(false);
    }
  };

  // Handle custom date change
  const handleDateChange = (): void => {
    setSelectedOption(DateRangeOption.Custom);
    setShowDatePicker(false);
    setShowOptions(false);
  };

  // Memoized display value
  const displayValue = useMemo(() => {
    if (currentValue?.date === DateRangeOption?.Custom && date?.from) {
      return `${format(date.from, 'MMM dd, yyyy')} - ${
        date.to
          ? format(date.to, 'MMM dd, yyyy')
          : format(date.from, 'MMM dd, yyyy')
      }`;
    }
    return (
      options.find((opt) => opt.value === currentValue?.date)?.label ||
      'Select date'
    );
  }, [date, currentValue, options]);

  // Custom Select Item with improved typing and functionality
  const CustomSelectItem = React.forwardRef<
    HTMLDivElement,
    { option: DateOption }
  >(({ option }, ref) => {
    if (option.value === DateRangeOption.Custom) {
      return (
        <div ref={ref} className="relative">
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowDatePicker(true);
            }}
            // value={option.value}
            className="text-grey-900 hover:bg-grey-50 border-t px-md py-sm text-grey-dark:bg-grey-800 dark:hover:bg-grey-700 dark:text-grey-50 cursor-pointer transition-all ease-in-out"
          >
            {option.label}
          </div>
        </div>
      );
    }

    return (
      <SelectItem
        value={option.value}
        ref={ref}
        className="text-grey-900 dark:bg-grey-800 dark:hover:bg-grey-700 dark:text-grey-50 cursor-pointer transition-all ease-in-out"
      >
        {option.label}
      </SelectItem>
    );
  });

  CustomSelectItem.displayName = 'CustomSelectItem';

  return (
    <div className="w-fit relative">
      <Select value={currentValue.date} onValueChange={handleOptionChange}>
        <SelectTrigger
          className="w-max"
          onClick={() => setShowOptions(!showOptions)}
        >
          <Calendar />
          <SelectValue className="">
            <span className="text-black dark:text-grey-100 font-body16">
              {displayValue}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          className={`min-w-[170px] absolute top-0 ${
            showDatePicker ? '-left-12' : ''
          } bg-white dark:bg-grey-800 rounded-md shadow-lg z-50`}
        >
          {showDatePicker ? (
            <div className="bg-white dark:bg-grey-900 text-black py-2">
              <div className="flex justify-center items-center gap-1">
                {date?.from ? (
                  date?.to ? (
                    <>
                      <>
                        <span className="border p-2 rounded-lg">
                          {format(date?.from || '', 'LLL dd, y')}
                        </span>
                        -{' '}
                        <span className="border p-2 rounded-lg">
                          {format(date?.to || '', 'LLL dd, y')}
                        </span>
                      </>
                      <div className="text-center"></div>
                    </>
                  ) : (
                    format(date?.from, 'LLL dd, y')
                  )
                ) : (
                  <div>Pick a date</div>
                )}
              </div>

              <Calendar
                initialFocus
                mode="range"
                defaultMonth={new Date()}
                selected={{
                  from: new Date(date?.from || ''),
                  to: new Date(date?.to || ''),
                }}
                onSelect={(newValue) => {
                  setDate({
                    from:
                      newValue?.from?.toString() != 'Invalid Date'
                        ? newValue?.from || null
                        : todayDate,
                    to:
                      newValue?.to?.toString() != 'Invalid Date'
                        ? newValue?.to || null
                        : todayDate,
                  });
                }}
              />
              <div className="w-full flex items-center justify-center gap-2">
                <Button
                  variant={'outline'}
                  onClick={() => {
                    setShowDatePicker(false);
                    setDate({ from: null, to: null });
                  }}
                  className="border-none bg-white dark:bg-grey-900 text-black dark:text-grey-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDateChange()}
                  className="border-none"
                >
                  Apply
                </Button>
              </div>
            </div>
          ) : (
            <>
              {options.map((option) => (
                <CustomSelectItem key={option.value} option={option} />
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomDateSelector;
