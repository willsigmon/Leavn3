import React from 'react';
    import { cn } from '@/lib/utils';
    import { Button } from '@/components/ui/button';

    const SegmentedControl = ({ options, value, onChange, name }) => {
      return (
        <div className="flex w-full p-0.5 bg-muted dark:bg-muted/50 rounded-lg shadow-sm">
          {options.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              name={name}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex-1 h-8 text-xs px-2 py-1 rounded-md transition-all duration-200 ease-in-out focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
                value === option.value
                  ? "bg-background text-primary shadow-sm dark:bg-primary dark:text-primary-foreground"
                  : "text-muted-foreground hover:bg-background/50 dark:hover:bg-white/5"
              )}
              aria-pressed={value === option.value}
            >
              {option.icon && <span className="mr-1.5">{option.icon}</span>}
              {option.label}
            </Button>
          ))}
        </div>
      );
    };

    export default SegmentedControl;
