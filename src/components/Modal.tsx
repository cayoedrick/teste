import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, y: '100%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '100%', scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-primary z-[101] rounded-[24px] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 pb-4 border-b border-tertiary">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button onClick={onClose} className="p-2 bg-secondary rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
