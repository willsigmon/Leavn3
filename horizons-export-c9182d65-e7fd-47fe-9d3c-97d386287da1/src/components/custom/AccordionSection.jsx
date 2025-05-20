import React from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { ChevronDown } from 'lucide-react';

    const AccordionSection = ({ title, icon, children, sectionName, isOpen, onToggle }) => {
      return (
        <div className="border-b border-border/30 dark:border-border/20">
          <button
            className="flex justify-between items-center w-full py-3.5 text-left text-sm font-medium text-foreground/80 hover:text-foreground focus:outline-none focus-visible:ring focus-visible:ring-primary/50 focus-visible:ring-opacity-75 rounded-md px-1"
            onClick={() => onToggle(sectionName)}
            aria-expanded={isOpen}
            aria-controls={`section-content-${sectionName}`}
          >
            <div className="flex items-center">
              {React.cloneElement(icon, { className: "h-4 w-4 mr-2.5 text-primary/80 dark:text-sky-400/80" })}
              <span className="text-xs sm:text-sm">{title}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id={`section-content-${sectionName}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } }}
                exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeOut" } }}
                className="overflow-hidden"
              >
                <div className="pb-3 pt-1 pl-1 text-xs text-foreground/70 dark:text-foreground/60">
                  {children}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    };

    export default AccordionSection;