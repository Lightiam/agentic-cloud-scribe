
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface InputMethodToggleProps {
  inputMethod: 'manual' | 'json';
  onInputMethodChange: (method: 'manual' | 'json') => void;
}

const InputMethodToggle: React.FC<InputMethodToggleProps> = ({
  inputMethod,
  onInputMethodChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={inputMethod === 'json'}
        onCheckedChange={(checked) => onInputMethodChange(checked ? 'json' : 'manual')}
      />
      <Label className="text-sm">Use JSON file upload</Label>
    </div>
  );
};

export default InputMethodToggle;
