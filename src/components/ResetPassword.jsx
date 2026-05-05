import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { Link } from "react-router"
import { UserContext } from './UserContext'
import { supabase } from '../client.js'

const ResetPassword = () => {
    // Store the new password for password reset:
    const [newPassword, setNewPassword] = useState('');

    // Have a confirm password field to make sure the user types the password they want:
    const [confirmPassword, setConfirmPassword] = useState('');

    // Function to handle password resetting:
    const resetPassword = async (e) => {
        e.preventDefault();
        // Check if the new password and confirm password match:
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) {
            console.error('Error updating password:', error);
            alert('Failed to update password.');
        } else {
            alert('Password updated successfully! Please log in with your new password.');
        }
    };

    // I can use useNavigate() to easily go forward or backwards in browser history.
    const navigate = useNavigate();

    return (
        <div className="ResetPassword">
            <h1>Please Enter New Password</h1>
            <form onSubmit={resetPassword} className="reset-form">
                <input 
                    type="password" 
                    placeholder="Enter new password" 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Confirm new password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Update Password</button>
            </form>
        </div>
    );
};

export default ResetPassword