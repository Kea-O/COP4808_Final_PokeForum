import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { Link } from "react-router"
import { UserContext } from './UserContext'
import { supabase } from '../client.js'

const LoginSignUp = () => {
    // Store the sign up credentials:
    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Switch pages between login/signup depending on the user's choice:
    const [showLogin, setShowLogin] = useState(false);

    // Triggert state to switch form to password reset:
    const [wantReset, setWantReset] = useState(false);

    // Function to handle signing up a new user:
    const signUpUser = async (e) => {
        console.log('Logging in with credentials:', credentials);
        // Prevent page refresh on form submit:
        e.preventDefault();
        // Use Supabase to sign up the user with the provided credentials.
        // Store the username in the user metadata.
        const { error } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
                data: {
                    username: credentials.username
                }
            }
        });
        if (error) {
            console.error('Error signing up:', error);
        } else {
            alert('Sign up successful! Please check your email to confirm your account.');
        }
    };

    // Function to handle logging in an existing user:
    const loginUser = async (e) => {
        // Prevent page refresh on form submit:
        e.preventDefault();
        // Use Supabase to log in the user with the provided credentials:
        const { error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
        });
        if (error) {
            console.error('Error logging in:', error);
            alert('Error: ' + error.message);
        } else {
            alert('Login successful!');
            navigate('/');
        }
    };

    // A function for users to log in with Google:
    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin // Takes them back to your home page
            }
        });
        
        if (error) {
            console.error("Error logging in with Google:", error.message);
            alert("Error: " + error.message);
        }
    };

    // Function to handle password resetting:
    const sendResetPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://pokeforums.netlify.app/update-password',
        });
        if (error) {
            console.error("Reset Error:", error.message);
            alert("Error: " + error.message);
        } else {
            alert("Success! A password reset link has been sent to your email.");
            navigate('/login');
        }
    };

    // I can use useNavigate() to easily go forward or backwards in browser history.
    const navigate = useNavigate();

    if (wantReset) {
        return (
            <div className="LoginSignUp">
                <button className="back-home-button" onClick={() => setWantReset(false)}>
                    Back
                </button>
                <h1>Reset Password</h1>
                <form className="reset-form" onSubmit={(e) => {
                    e.preventDefault();
                    sendResetPassword(credentials.email);
                }}>
                    <input 
                        type="email" 
                        placeholder="Enter email..." 
                        value={credentials.email} 
                        onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                        required 
                    />
                    <button type="submit">Send Reset Email</button>
                </form>
            </div>
        );
    }

    if (showLogin) {
        return (
            <div className="LoginSignUp">
                {/* Login form */}
                <h1>Login</h1>
                <form className="login-form" onSubmit={(e) => loginUser(e)}>
                    <input 
                        type="email" 
                        placeholder="Email"
                        value={credentials.email} 
                        onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={credentials.password} 
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                        required 
                    />
                    <button type="submit">Login</button>
                </form>
                <button className="login-toggle" onClick={() => setShowLogin(!showLogin)}>
                    {showLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
                </button>
                <button className="login-toggle" onClick={() => setWantReset(true)}>
                    Forgot Your Password?
                </button>
            </div>
        );
    }

    return (
        <div className="LoginSignUp">
            {/* Sign up form */}
            <Link to="/" className="back-home-button">
                Back
            </Link>
            <h1>Sign Up</h1>
            <form className="signup-form" onSubmit={(e) => signUpUser(e)}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={credentials.username} 
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={credentials.email} 
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={credentials.password} 
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                    required 
                />
                <button type="submit">Sign Up</button>
            </form>
            <button onClick={loginWithGoogle} className="google-login-button">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" />
                <span>Continue with Google</span>
            </button>
            <button className="login-toggle" onClick={() => setShowLogin(!showLogin)}>
                {showLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
            </button>
        </div>
    );
}

export default LoginSignUp
