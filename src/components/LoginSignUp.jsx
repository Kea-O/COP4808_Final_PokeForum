import { useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext'
import { supabase } from '../client.js'

const LoginSignUp = () => {
    // Store the sign up credentials:
    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Switch pages to the login page if the user has already signed up:
    const [showLogin, setShowLogin] = useState(false);

    // Function to handle signing up a new user:
    const signUpUser = async (e) => {
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
        } else {
            alert('Login successful!');
        }
    };

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
            </div>
        );
    }

    return (
        <div className="LoginSignUp">
            {/* Sign up form */}
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
            <button className="login-toggle" onClick={() => setShowLogin(!showLogin)}>
                {showLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
            </button>
        </div>
    );
}

export default LoginSignUp
