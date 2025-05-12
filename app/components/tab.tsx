// @ts-nocheck
'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  isValidElement,
  Children,
} from 'react';

interface TabContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
  wobbly: boolean;
  hover: boolean;
  defaultValue: string;
  prevIndex: number;
  setPrevIndex: (value: number) => void;
  tabsOrder: string[];
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const useTabs = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
};

interface TabsProviderProps {
  children: ReactNode;
  defaultValue: string;
  wobbly?: boolean;
  hover?: boolean;
}

export const TabsProvider = ({
  children,
  defaultValue,
  wobbly = true,
  hover = false,
}: TabsProviderProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const [prevIndex, setPrevIndex] = useState(0);
  const [tabsOrder, setTabsOrder] = useState<string[]>([]);

  useEffect(() => {
    const order: string[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        if (child.type === TabsContent) {
          order.push(child.props.value);
        }
      }
    });
    setTabsOrder(order);
  }, [children]);

  return (
    <TabContext.Provider
      value={{
        activeTab,
        setActiveTab,
        wobbly,
        hover,
        defaultValue,
        setPrevIndex,
        prevIndex,
        tabsOrder,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const TabsBtn = ({ children, className, value, disabled }: any) => {
  const {
    activeTab,
    setPrevIndex,
    setActiveTab,
    defaultValue,
    hover,
    wobbly,
    tabsOrder,
  } = useTabs();

  const handleClick = () => {
    if (disabled) return;
    setPrevIndex(tabsOrder.indexOf(activeTab));
    setActiveTab(value);
  };

  const isActive = activeTab === value;

  return (
    <motion.button
      type="button"
      className={cn(
        `cursor-pointer sm:p-2 p-1 sm:px-4 px-2 rounded-md relative overflow-hidden`,
        `text-muted-foreground hover:text-foreground transition-colors`,
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        isActive && 'text-foreground',
        className
      )}
      onFocus={() => {
        hover && !disabled && handleClick();
      }}
      onMouseEnter={() => {
        hover && !disabled && handleClick();
      }}
      onClick={handleClick}
    >
      {isActive && (
        <AnimatePresence mode='wait'>
          <motion.div
            transition={{
              layout: {
                duration: 0.2,
                ease: 'easeInOut',
                delay: 0.2,
              },
            }}
            layoutId={defaultValue}
            className='absolute inset-0 bg-background dark:bg-background rounded-md shadow-sm border border-border'
          />
        </AnimatePresence>
      )}

      {wobbly && isActive && (
        <>
          <AnimatePresence mode='wait'>
            <motion.div
              transition={{
                layout: {
                  duration: 0.4,
                  ease: 'easeInOut',
                  delay: 0.04,
                },
              }}
              layoutId={defaultValue}
              className='absolute inset-0 bg-background dark:bg-background rounded-md shadow-sm border border-border'
            />
          </AnimatePresence>
          <AnimatePresence mode='wait'>
            <motion.div
              transition={{
                layout: {
                  duration: 0.4,
                  ease: 'easeOut',
                  delay: 0.2,
                },
              }}
              layoutId={`${defaultValue}b`}
              className='absolute inset-0 bg-background dark:bg-background rounded-md shadow-sm border border-border'
            />
          </AnimatePresence>
        </>
      )}

      <div className="relative inline-flex items-center gap-1.5 md:gap-2">
        {children}
      </div>
    </motion.button>
  );
};

export const TabsContent = ({ children, className, value, yValue }: any) => {
  const { activeTab, tabsOrder, prevIndex } = useTabs();
  const isForward = tabsOrder.indexOf(activeTab) > prevIndex;

  return (
    <AnimatePresence mode='popLayout'>
      {activeTab === value && (
        <motion.div
          initial={{ opacity: 0, y: yValue ? (isForward ? 10 : -10) : 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: yValue ? (isForward ? -50 : 50) : 0 }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          className={cn('p-2 px-4 rounded-md relative', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};