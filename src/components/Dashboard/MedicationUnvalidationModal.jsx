import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

const PRESET_REASONS = [
    'Validated but not administered',
    'Administered in error — wrong medication',
    'Administered in error — wrong dose',
    'Administered in error — wrong time of day',
    'Patient refused after record was created',
    'Documentation error',
    'Other',
];

function MedicationUnvalidationModal({ medication, onConfirm, onCancel, isSaving }) {
    const [selected, setSelected] = useState('');
    const [otherText, setOtherText] = useState('');

    const isOther = selected === 'Other';
    const canSubmit = selected && (!isOther || otherText.trim().length > 0);
    const effectiveReason = isOther ? otherText.trim() : selected;

    function handleConfirm() {
        if (!canSubmit) return;
        onConfirm(effectiveReason);
    }

    function handleCancel() {
        setSelected('');
        setOtherText('');
        onCancel();
    }

    return (
        <AnimatePresence>
            {medication && (
                <>
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCancel}
                    />

                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 12 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div
                            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-amber-50 p-1.5">
                                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-semibold text-gray-900">Unvalidate medication</h2>
                                        <p className="text-xs text-gray-500">{medication.name}</p>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={handleCancel}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </motion.button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5 space-y-3">
                                <p className="text-xs font-medium text-gray-700">Reason to unvalidate:</p>
                                <div className="space-y-2">
                                    {PRESET_REASONS.map((reason) => (
                                        <label
                                            key={reason}
                                            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                                                selected === reason
                                                    ? 'border-amber-400 bg-amber-50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="unvalidationReason"
                                                value={reason}
                                                checked={selected === reason}
                                                onChange={() => {
                                                    setSelected(reason);
                                                    if (reason !== 'Other') setOtherText('');
                                                }}
                                                className="accent-amber-500 shrink-0"
                                            />
                                            <span className="text-sm text-gray-700">{reason}</span>
                                        </label>
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {isOther && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.18 }}
                                            className="overflow-hidden"
                                        >
                                            <textarea
                                                autoFocus
                                                value={otherText}
                                                onChange={(e) => setOtherText(e.target.value)}
                                                placeholder="Please describe the reason…"
                                                rows={3}
                                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
                                <motion.button
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleConfirm}
                                    disabled={!canSubmit || isSaving}
                                    whileHover={canSubmit && !isSaving ? { scale: 1.02 } : {}}
                                    whileTap={canSubmit && !isSaving ? { scale: 0.98 } : {}}
                                    className="flex-1 rounded-lg bg-amber-500 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                                >
                                    {isSaving ? 'Saving…' : 'Unvalidate'}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default MedicationUnvalidationModal;
