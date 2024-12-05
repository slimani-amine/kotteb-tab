import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
}) => {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-offset-2 focus-visible:ring-offset-white
        ${checked ? 'bg-[#FECA30]' : 'bg-gray-200'}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      `}
    >
      <SwitchPrimitive.Thumb
        className={`
          block h-5 w-5 rounded-full bg-white shadow-lg ring-0
          transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </SwitchPrimitive.Root>
  );
};
