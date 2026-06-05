import { useState } from 'react';
import { authAPI } from '../api/auth';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import MagneticButton from '../components/MagneticButton';
import { useNotificationService } from '../components/Notifications/notificationService';

const inputClass = "flex h-10 w-full rounded-lg border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all hover:border-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:border-brand-300";

function Orbs() {
    return (
        <>
            <motion.div
                className="pointer-events-none absolute top-[15%] left-[20%] h-80 w-80 rounded-full bg-brand-100 blur-2xl"
                animate={{ x: [0, 24, 0], y: [0, 32, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                style={{ opacity: 0.9 }}
            />
            <motion.div
                className="pointer-events-none absolute bottom-[15%] right-[20%] h-72 w-72 rounded-full bg-brand-200 blur-2xl"
                animate={{ x: [0, -20, 0], y: [0, -24, 0] }}
                transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                style={{ opacity: 0.8 }}
            />
            <motion.div
                className="pointer-events-none absolute top-[40%] right-[25%] h-60 w-60 rounded-full bg-amber-100 blur-2xl"
                animate={{ x: [0, 16, 0], y: [0, -20, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                style={{ opacity: 0.7 }}
            />
        </>
    );
}

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { sendErrorNotification } = useNotificationService();

    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#FFFDF2] p-4">
                <Orbs />
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-md rounded-2xl border border-brand-200/50 bg-brand-50/40 px-8 py-10 shadow-xl shadow-black/[0.06] backdrop-blur-2xl text-center"
                >
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Invalid reset link</h1>
                    <p className="mt-3 text-sm text-zinc-500">
                        This password reset link is invalid or missing. Please request a new one.
                    </p>
                    <p className="mt-6 text-sm text-zinc-500">
                        <Link to="/forgot-password" className="font-medium text-brand-600 hover:underline">
                            Request a new reset link
                        </Link>
                    </p>
                </motion.div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            sendErrorNotification('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await authAPI.resetPassword(token, newPassword);
            setSuccess(true);
        } catch (error) {
            sendErrorNotification(error.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#FFFDF2] p-4">
                <Orbs />
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-md rounded-2xl border border-brand-200/50 bg-brand-50/40 px-8 py-10 shadow-xl shadow-black/[0.06] backdrop-blur-2xl text-center"
                >
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Password reset</h1>
                    <p className="mt-3 text-sm text-zinc-500">
                        Your password has been successfully reset.
                    </p>
                    <p className="mt-6 text-sm text-zinc-500">
                        <Link to="/signin" className="font-medium text-brand-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#FFFDF2] p-4">
            <Orbs />
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md rounded-2xl border border-brand-200/50 bg-brand-50/40 px-8 py-10 shadow-xl shadow-black/[0.06] backdrop-blur-2xl"
            >
                <div className="mb-7 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Choose a new password</h1>
                    <p className="mt-1 text-sm text-zinc-500">Your new password must be at least 8 characters.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label htmlFor="newPassword" className="text-sm font-medium text-zinc-700">New password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700">Confirm new password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm new password"
                            className={inputClass}
                        />
                    </div>

                    <MagneticButton
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2 h-10 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {loading ? 'Resetting…' : 'Reset Password'}
                    </MagneticButton>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-500">
                    <Link to="/signin" className="font-medium text-brand-600 hover:underline">
                        Back to sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

export default ResetPasswordPage;
