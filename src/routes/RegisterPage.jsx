import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import MagneticButton from '../components/MagneticButton';
import { authAPI } from '../api/auth';
import { useNotificationService } from '../components/Notifications/notificationService';

const inputClass = "flex h-10 w-full rounded-lg border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all hover:border-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:border-indigo-300";

function RegisterPage() {
    const navigate = useNavigate();
    const { sendErrorNotification } = useNotificationService();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            sendErrorNotification('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await authAPI.signup(
                formData.firstName,
                formData.lastName,
                formData.username,
                formData.email,
                formData.password,
            );
            navigate('/dashboard');
        } catch (error) {
            sendErrorNotification(error.response?.data?.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#FFFDF2] p-4">

            {/* Gradient orbs */}
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

            {/* Glass card */}
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md rounded-2xl border border-white/60 bg-white/30 px-8 py-10 shadow-xl shadow-black/[0.06] backdrop-blur-2xl"
            >
                <div className="mb-7 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Create an account</h1>
                    <p className="mt-1 text-sm text-zinc-500">Get started with CareSync today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label htmlFor="firstName" className="text-sm font-medium text-zinc-700">First name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                placeholder="First name"
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="lastName" className="text-sm font-medium text-zinc-700">Last name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                placeholder="Last name"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="username" className="text-sm font-medium text-zinc-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter username"
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-zinc-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email address"
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-zinc-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700">Confirm password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm password"
                            className={inputClass}
                        />
                    </div>

                    <MagneticButton
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 h-10 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {loading ? 'Creating account…' : 'Sign Up'}
                    </MagneticButton>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-500">
                    Already have an account?{' '}
                    <Link to="/signin" className="font-medium text-indigo-600 hover:underline">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

export default RegisterPage;
