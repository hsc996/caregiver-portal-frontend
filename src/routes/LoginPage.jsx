import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuthContext } from '../contexts/AuthContext/AuthContext';
import { authAPI } from '../api/auth';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent} from '../components/ui/Card';

function LoginPage(){
    console.log('🌐 VITE_API_URL:', import.meta.env.VITE_API_URL);
    const [, setUserJwt] = useUserAuthContext();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await authAPI.signin(email, password);
            setUserJwt(result.token);
            localStorage.setItem('refreshToken', result.refreshToken);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error.response?.data);
            setError(error.response?.data?.message || "Sign in failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center mb-4">Welcome back!</CardTitle>
                    <CardDescription>Login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='space-y-2'>
                            <label htmlFor="email" className="text-sm font-medium leading-none">
                                Email
                            </label>
                            <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Enter email"
                            />
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor='password' className='text-sm font-medium leading-none'>
                                Password
                            </label>
                            <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Enter password"
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* Forgot password link */}
                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                        type="submit"
                        disabled={loading}
                        className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full'
                        >
                            {loading ? 'Signing you in...' : 'Sign In'}
                        </button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className='text-sm text-muted-foreground text-center w-full'>
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary hover:underline font-medium">
                        Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default LoginPage;