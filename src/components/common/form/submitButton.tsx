import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface FormButtonGroupProps {
  isSubmitting: boolean;
  isValid?: boolean;
  disabled?: boolean;
  className?: string;

  // Submit button customization
  submitText?: {
    create?: string;
    edit?: string;
    default?: string;
  };
  submitLoadingText?: {
    create?: string;
    edit?: string;
    default?: string;
  };

  // Cancel button customization
  cancel?: {
    show?: boolean;
    text?: string;
    onClick: () => void;
  };

  // Mode detection
  mode?: 'create' | 'edit';
}

export const FormButtonGroup: React.FC<FormButtonGroupProps> = ({
  isSubmitting,
  isValid = true,
  disabled = false,
  className = '',

  submitText = {},
  submitLoadingText = {},

  cancel = {
    show: true,
    text: 'Cancel',
    onClick: () => {},
  },

  mode = 'create',
}) => {
  // Memoized button texts to prevent unnecessary recalculations
  const buttonTexts = React.useMemo(
    () => ({
      submit:
        mode === 'edit'
          ? submitText.edit || submitText.default || 'Update'
          : submitText.create || submitText.default || 'Create',

      loading:
        mode === 'edit'
          ? submitLoadingText.edit || submitLoadingText.default || 'Updating...'
          : submitLoadingText.create ||
            submitLoadingText.default ||
            'Creating...',

      cancel: cancel.text || 'Cancel',
    }),
    [mode, submitText, submitLoadingText, cancel.text],
  );

  return (
    <div className={`flex justify-end gap-4 ${className}`}>
      {cancel.show && (
        <Button
          type="button"
          variant="outline"
          onClick={cancel.onClick}
          disabled={isSubmitting || disabled}
        >
          {buttonTexts.cancel}
        </Button>
      )}

      <Button type="submit" disabled={isSubmitting || !isValid || disabled}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {buttonTexts.loading}
          </>
        ) : (
          buttonTexts.submit
        )}
      </Button>
    </div>
  );
};
