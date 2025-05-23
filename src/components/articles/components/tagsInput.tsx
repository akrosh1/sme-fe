import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React, { KeyboardEvent, useRef, useState } from 'react';

interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  disabled?: boolean;
  className?: string;
  tagClassName?: string;
  inputClassName?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const TagsInput: React.FC<TagsInputProps> = ({
  tags = [],
  onTagsChange,
  placeholder = 'Add a tag...',
  maxTags,
  allowDuplicates = false,
  disabled = false,
  className,
  tagClassName,
  inputClassName,
  variant = 'secondary',
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();

    if (!trimmedTag) return;

    // Check for duplicates
    if (
      !allowDuplicates &&
      tags.some((t) => t.toLowerCase() === trimmedTag.toLowerCase())
    ) {
      setInputValue('');
      return;
    }

    // Check max tags limit
    if (maxTags && tags.length >= maxTags) {
      setInputValue('');
      return;
    }

    onTagsChange([...tags, trimmedTag]);
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        addTag(inputValue);
        break;
      case 'Backspace':
        if (inputValue === '' && tags.length > 0) {
          removeTag(tags.length - 1);
        }
        break;
      case ',':
      case ';':
        e.preventDefault();
        addTag(inputValue);
        break;
      case 'Escape':
        setInputValue('');
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const handleContainerClick = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const isMaxTagsReached = maxTags ? tags.length >= maxTags : false;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant={variant}
              className={cn(
                'flex items-center gap-1 px-2 py-1 text-sm',
                tagClassName,
              )}
            >
              <span>{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div
        className={cn(
          'flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50',
          isMaxTagsReached && 'opacity-50',
        )}
        onClick={handleContainerClick}
      >
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          placeholder={
            isMaxTagsReached ? `Max ${maxTags} tags reached` : placeholder
          }
          disabled={disabled || isMaxTagsReached}
          className={cn(
            'border-0 p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
            inputClassName,
          )}
        />
      </div>

      {/* Helper Text */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Press Enter, comma, or semicolon to add tags</span>
        {maxTags && (
          <span>
            {tags.length}/{maxTags} tags
          </span>
        )}
      </div>
    </div>
  );
};
