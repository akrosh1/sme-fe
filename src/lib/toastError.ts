import { toast } from '@/hooks/useToast';
import { IResponseError } from '@/interface/api/api.interface';
import normalizeCamelCase from '@/utils/normalizeCamelCase';
import { isEmpty } from '@/utils/objectUtils';

function getErrorMessage(error: object) {
  Object.entries(error).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Handle string error messages
      toast({
        variant: 'error', // Changed to 'error' to match your toast implementation
        title: normalizeCamelCase(key),
        description: value,
      });
    } else if (Array.isArray(value)) {
      // Handle array of error messages
      value.forEach((err) => {
        if (typeof err === 'string') {
          toast({
            variant: 'error',
            title: normalizeCamelCase(key),
            description: err,
          });
        }
        if (typeof err === 'object' && err !== null) {
          getErrorMessage(err);
        }
      });
    } else {
      // Handle generic errors
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Something went wrong',
      });
    }
  });
}

export default function toastError(error: IResponseError | undefined | null) {
  if (!error) return;

  // Handle string errors (dev mode only)
  if (typeof error === 'string') {
    // if (process.env.NODE_ENV === 'development') {
    toast({
      variant: 'error',
      title: 'Error',
      description: error,
    });
    // }
    return;
  }

  // Skip empty errors
  if (error === undefined || error === null || isEmpty(error)) return;

  // Process error object
  getErrorMessage(error);
}
