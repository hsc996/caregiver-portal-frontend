import { AnimatePresence, motion } from 'motion/react';
import { Pill, Clock, X } from 'lucide-react';

function MedicationValidationModal({ medication, onConfirm, onCancel, isSaving }) {
    return (
        <AnimatePresence>
            {medication && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                    />

                    {/* Modal */}
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
                                    <div className="rounded-lg bg-indigo-50 p-1.5">
                                        <Pill className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <h2 className="text-sm font-semibold text-gray-900">Confirm medication given</h2>
                                </div>
                                <motion.button
                                    onClick={onCancel}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </motion.button>
                            </div>

                            {/* Medication details */}
                            <div className="px-6 py-5 space-y-3">
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Medication</span>
                                        <span className="font-medium text-gray-900">{medication.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Dose</span>
                                        <span className="font-medium text-gray-900">{medication.dosage || '—'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Route</span>
                                        <span className="font-medium text-gray-900">{medication.route || '—'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Frequency</span>
                                        <span className="font-medium text-gray-900">{medication.frequency || '—'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> Scheduled
                                        </span>
                                        <span className="font-medium text-gray-900">{medication.time}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    This will be recorded with your name and the current timestamp.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
                                <motion.button
                                    onClick={onCancel}
                                    disabled={isSaving}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={onConfirm}
                                    disabled={isSaving}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                                >
                                    {isSaving ? 'Saving…' : 'Validate'}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default MedicationValidationModal;
