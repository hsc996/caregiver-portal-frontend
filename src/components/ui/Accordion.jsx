import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const CONTENT_VARIANTS = {
    open:   { height: 'auto', opacity: 1, y: 0  },
    closed: { height: 0,      opacity: 0, y: -8 },
};

const TRANSITION = { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] };

export function AccordionSection({ icon: Icon, label, open, onToggle, action, children }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={onToggle}
                    className="flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-700 uppercase hover:text-gray-900 transition-colors"
                    aria-expanded={open}
                >
                    {Icon && <Icon className="h-4 w-4" />}
                    {label}
                    <motion.span
                        animate={{ rotate: open ? 0 : -90 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        style={{ display: 'flex' }}
                    >
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    </motion.span>
                </button>
                {action}
            </div>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={CONTENT_VARIANTS}
                        transition={TRANSITION}
                        style={{ overflow: 'hidden' }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
