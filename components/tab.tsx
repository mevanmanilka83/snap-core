'use client';

import React, { createContext, useContext, useState, useEffect, Children } from 'react';
import { cn } from '@/lib/utils';

interface TabsContextType {
  value: string;
  setValue: (value: string) => void;
  tabs: { value: string; disabled?: boolean }[];
  wobbly?: boolean;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProviderProps {
  children: React.ReactNode;
  defaultValue: string;
  wobbly?: boolean;
}

export function TabsProvider({ children, defaultValue, wobbly = false }: TabsProviderProps) {
  const [value, setValue] = useState(defaultValue);
  const [tabs, setTabs] = useState<{ value: string; disabled?: boolean }[]>([]);

  useEffect(() => {
    const tabsList: { value: string; disabled?: boolean }[] = [];
    Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const props = child.props as { value: string; disabled?: boolean };
        if (props.value) {
          tabsList.push({ value: props.value, disabled: props.disabled });
        }
      }
    });
    setTabs(tabsList);
  }, [children]);

  return (
    <TabsContext.Provider value={{ value, setValue, tabs, wobbly }}>
      {children}
    </TabsContext.Provider>
  );
}

interface TabsBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

export function TabsBtn({ value, disabled, className, ...props }: TabsBtnProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsBtn must be used within TabsProvider');

  const isActive = context.value === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      disabled={disabled}
      onClick={() => !disabled && context.setValue(value)}
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
        context.wobbly && isActive && 'animate-wobble',
        className
      )}
      {...props}
    />
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within TabsProvider');

  if (context.value !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn('mt-2', className)}
    >
      {children}
    </div>
  );
} 