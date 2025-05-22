import { Toggle } from '@/components/ui/toggle';
import { Editor } from '@tiptap/react';
import { ReactNode } from 'react';

interface FormatToggleProps {
  editor: Editor | null;
  format: string | { textAlign: string };
  icon: ReactNode;
  ariaLabel: string;
  toggleAction: () => void;
}

const FormatToggle: React.FC<FormatToggleProps> = ({
  editor,
  format,
  icon,
  ariaLabel,
  toggleAction,
}) => {
  if (!editor) return null;

  const isActive =
    typeof format === 'string'
      ? editor.isActive(format)
      : editor.isActive(format);

  return (
    <Toggle
      size="sm"
      pressed={isActive}
      onPressedChange={toggleAction}
      aria-label={ariaLabel}
    >
      {icon}
    </Toggle>
  );
};

export default FormatToggle;
