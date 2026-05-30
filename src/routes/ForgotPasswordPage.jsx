import { useState } from 'react';
import { authAPI } from '../api/auth';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import MagneticButton from '../components/MagneticButton';
import { useNotificationService } from '../components/Notifications/notificationService';

const inputClass = "flex h-10 w-full rounded-lg border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all hover:border-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:border-indigo-300";

function Orbs() {
    return (
        <>
            <motion.div
                className="pointer-events-none absolute top-[15%] left-[20%] h-80 w-80 rounded-full bg-[#ededfb] blur-2xl"
                animate={{ x: [0, 24, 0], y: [0, 32, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                style={{ opacity: 0.9 }}
            />
            <motion.div
                className="pointer-events-none absolute bottom-[15%] right-[20%] h-72 w-72 rounded-full bg-indigo-200 blur-2xl"
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

function ForgotPassword() {
    const { sendErrorNotification } = useNotificationService();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authAPI.requestPasswordReset(email);
            setSubmitted(true);
        } catch (error) {
            sendErrorNotification(error.response?.data?.message || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#FFFDF2] p-4">
                <Orbs />
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-md rounded-2xl border border-white/60 bg-white/30 px-8 py-10 shadow-xl shadow-black/[0.06] backdrop-blur-2xl text-center"
                >
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Check your email</h1>
                    <p className="mt-3 text-sm text-zinc-500">
                        If an account exists for{' '}
                        <span className="font-medium text-zinc-700">{email}</span>,
                        a password reset link has been sent.
                    </p>
                    <p className="mt-6 text-sm text-zinc-500">
                        <Link to="/signin" className="font-medium text-indigo-600 hover:underline">
                            Back to sign in
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
                className="relative w-full max-w-md rounded-2xl border border-white/60 bg-white/30 px-8 py-10 shadow-xl shadow-black/[0.06] backdrop-blur-2xl"
            >
                <div className="mb-7 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Reset your password</h1>
                    <p className="mt-1 text-sm text-zinc-500">Enter your email and we'll send you a reset link.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-zinc-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter email address"
                            className={inputClass}
                        />
                    </div>

                    <MagneticButton
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 h-10 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {loading ? 'Sending…' : 'Send Reset Email'}
                    </MagneticButton>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-500">
                    <Link to="/signin" className="font-medium text-indigo-600 hover:underline">
                        Back to sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

export default ForgotPassword;
