import { useState } from 'react';
import { authAPI } from '../api/auth';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";
import { useNotificationService } from '../components/Notifications/notificationService';

function ForgotPassword(){
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
            sendErrorNotification(error.response?.data?.message || "Failed to send reset email.");
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center mb-4">Check your email</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                            If an account exists for <span className="font-medium text-foreground">{email}</span>, a password reset link has been sent.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <p className='text-sm text-muted-foreground text-left w-full'>
                            Back to{' '}
                            <Link to="/signin" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center mb-4">Reset your password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">
                                Please enter your email address
                            </label>
                            <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Enter email address"
                            />
                        </div>
                        <button
                        type="submit"
                        disabled={loading}
                        className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full'
                        >
                            {loading ? 'Sending...' : 'Send Reset Email'}
                        </button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className='text-sm text-muted-foreground text-left w-full'>
                        Back to{' '}
                        <Link to="/signin" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ForgotPassword;