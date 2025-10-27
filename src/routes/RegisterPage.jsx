import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuthContext } from '../contexts/AuthContext/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { authAPI } from '../api/auth';

function RegisterPage(){
    const [, setUserJwt] = useUserAuthContext();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword){
            setError("Passwords do not match.");
            return;
        }

        setLoading(true)

        try {
            const result = await authAPI.signup(
                formData.username,
                formData.email,
                formData.password
            );
            setUserJwt(result.token);
            localStorage.setItem('refreshToken', result.refreshToken);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center mb-4">Create an account</CardTitle>
                    <CardDescription>Enter your details to create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='space-y-2'>
                            <label htmlFor="username" className='text-sm font-medium leading-none'>
                                Username
                            </label>
                            <input
                            type="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Enter username"
                            />
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor="email" className='text-sm font-medium leading-none'>
                                Email
                            </label>
                            <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Enter email address"
                            />
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor="password" className='text-sm font-medium leading-none'>
                                Password
                            </label>
                            <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Enter password"
                            />
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor="confirmPassword" className='text-sm font-medium leading-none'>
                                Confirm Password
                            </label>
                            <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Confirm password"
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <button
                        type="submit"
                        disabled={loading}
                        className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full'
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className='text-sm text-muted-foreground text-center w-full'>
                        Already have an account?{' '}
                        <Link to="/signin" className="text-primary hover:underline font-medium">
                        Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default RegisterPage;