import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface IConfirmationProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  content: { title: string; description?: string };
  handleConfirm: () => void;
}
export const ConfirmationModal = ({
  open,
  setOpen,
  content,
  handleConfirm,
}: IConfirmationProps) => {
  const handleOpenChange = () => {
    setOpen(!open);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>Open</DialogTrigger>
      <DialogContent
        id="dialogContent"
        className="bg-white border-none"
        role="dialog"
      >
        <DialogTitle className="text-primary">{content.title}</DialogTitle>
        {content.description && (
          <DialogDescription className="text-[16px] text-gray-800">
            {content.description}
          </DialogDescription>
        )}
        <DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant={'default'}
              size={'default'}
              onClick={handleConfirm}
              aria-label="Yes"
            >
              Yes
            </Button>

            <Button
              size="default"
              variant={'outline'}
              onClick={handleOpenChange}
              aria-label="Cancel"
            >
              Cancel
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
