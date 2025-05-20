import React, { useEffect, useRef } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Highlighter, StickyNote, Trash2, CheckSquare, XSquare } from 'lucide-react';
    import { useLocalization } from '@/hooks/useLocalization';

    const RadialMenu = ({ x, y, onAction, onClose, verseId, verseUserData }) => {
      const { t } = useLocalization();
      const menuRef = useRef(null);

      const highlightColor = verseUserData?.highlight;

      const actions = [
        { id: 'highlight-yellow', icon: <Highlighter className="h-5 w-5 text-yellow-500" />, label: 'Highlight Yellow', condition: () => highlightColor !== 'yellow'},
        { id: 'highlight-green', icon: <Highlighter className="h-5 w-5 text-green-500" />, label: 'Highlight Green', condition: () => highlightColor !== 'green'},
        { id: 'highlight-pink', icon: <Highlighter className="h-5 w-5 text-pink-500" />, label: 'Highlight Pink', condition: () => highlightColor !== 'pink'},
        { id: 'remove-highlight', icon: <Trash2 className="h-5 w-5 text-red-500" />, label: 'Remove Highlight', condition: () => !!highlightColor },
        { id: 'add-note', icon: <StickyNote className="h-5 w-5 text-blue-500" />, label: verseUserData?.note ? 'Edit Note' : 'Add Note' },
      ];

      const filteredActions = actions.filter(action => action.condition === undefined || action.condition());


      useEffect(() => {
        const handleClickOutside = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            onClose();
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, [onClose]);

      const radius = 80; 
      const angleStep = (2 * Math.PI) / filteredActions.length;

      return (
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[100] pointer-events-auto"
            style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative w-0 h-0">
              {filteredActions.map((action, index) => {
                const angle = angleStep * index - Math.PI / 2; // Start from top
                const itemX = radius * Math.cos(angle);
                const itemY = radius * Math.sin(angle);
                return (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x: itemX, y: itemY }}
                    exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: index * 0.03 }}
                    onClick={() => { onAction(action.id); onClose(); }}
                    className="absolute w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{ transform: 'translate(-50%, -50%)' }} 
                    title={action.label}
                    aria-label={action.label}
                  >
                    {action.icon}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      );
    };

    export default RadialMenu;
