import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client'
import { UserContext } from './UserContext'

const CreatePost = () => {
    // Store the post details:
    const [post, setPost] = useState({});

    // Store the user object from UserContext:
    const { user } = useContext(UserContext);

    // Different post types:
    const postTypes = ["Discussion", "Question", "News", "Other"];

    // Function to handle submitting a new post:
    const submitPost = async (e) => {
        // Prevent page refresh on form submit:
        e.preventDefault();

        // Check if the user is logged in before allowing them to submit a post:
        if (!user) {
            alert('You must be logged in to create a post!');
            return;
        }

        // Insert the new post into the SupaBase database
        const { error } = await supabase
            .from('Posts')
            .insert({
                title: post.title,
                type: post.type,
                authorID: user.id,
                authorName: user.user_metadata?.username || 'Anon',
                contentImage: post.contentImage,
                contentText: post.contentText
            });
        
        if (error) {
            console.error('Error creating post:', error);
        } else {
            // After submitting, navigate back to the homepage.
            navigate('/');
        }
    }

    // I can use useNavigate() to easily go forward or backwards in browser history.
    const navigate = useNavigate();

    return (
        <div className="CreatePost">
            {/* Heading container */}
            <div className="create-heading-container">
                <h1>Create a new post!</h1>
            </div>

            {/* Form container */}
            <div className="create-form-container">
                <form onSubmit={submitPost} className="create-post-form">
                    {/* Title is required */}
                    <input 
                        type="text" 
                        placeholder="Title..."
                        value={post?.title || ''}
                        onChange={(e) => setPost({...post, title: e.target.value})}
                        required
                    />

                    {/* Type is required */}
                    <select 
                        value={post?.type || ''}
                        onChange={(e) => setPost({...post, type: e.target.value})}
                        required
                    >
                        <option value="" disabled>--Select a Type--</option>
                        {postTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    {/* image URL is optional */}
                    <input 
                        type="text" 
                        placeholder="Optional image URL..."
                        value={post?.contentImage || ''}
                        onChange={(e) => setPost({...post, contentImage: e.target.value})}
                    />

                    {/* text is optional as well */}
                    <textarea 
                        placeholder="Write your post here..." 
                        value={post?.contentText || ''}
                        onChange={(e) => setPost({...post, contentText: e.target.value})}
                    />

                    {/* Buttons to discard the post or submit it */}
                    <div className="create-post-buttons">
                        <button type="button" onClick={() => navigate(-1)} className="create-post-discard-button">
                            Cancel
                        </button>
                        <button type="submit" className="create-post-submit-button">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePost
