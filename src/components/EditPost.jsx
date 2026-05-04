import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom"
import { UserContext } from './UserContext'
import { supabase } from '../client.js'

const EditPost = () => {
    // We put the ID of the post in the URL, so we can get it using useParams.
    // This lets us fetch data even if the page is refreshed.
    const { id } = useParams();

    // Store the post details:
    const [post, setPost] = useState({});

    // Different post types:
    const postTypes = ["Discussion", "Question", "News", "Other"];

    // Function to handle editing a post:
    const editPost = async (e) => {
        // Prevent page refresh on form submit:
        e.preventDefault();

        // Update the post in the SupaBase database
        await supabase
            .from('Posts')
            .update({
                title: post.title,
                type: post.type,
                contentImage: post.contentImage,
                contentText: post.contentText
            })
            .eq('id', id);

        // After finishing, navigate back to the homepage.
        navigate('/');
    }

    // Function to handle deleting a post:
    const deletePost = async () => {
        // Delete the post from the SupaBase database. Cascade delete is
        // set on Supabase's end, so the comments will be deleted automatically.
        await supabase
            .from('Posts')
            .delete()
            .eq('id', id);

        // After finishing, navigate back to the homepage.
        navigate('/');
    }

    // useEffect to fetch the post we're going to edit. Use the ID we got
    // from the URL.
    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase
                .from('Posts')
                .select()
                .eq('id', id)
                .single()
            setPost(data)
        };
        fetchPost();
    }, [id]);

    // I can use useNavigate() to easily go forward or backwards in browser history.
    const navigate = useNavigate();

    return (
        <div className="CreatePost">
            {/* Heading container */}
            <div className="create-heading-container">
                <h1>Editing...</h1>
            </div>

            {/* Form container */}
            <div className="create-form-container">
                <form onSubmit={editPost} className="create-post-form">
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
                        <button type="button" onClick={deletePost} className="create-post-delete-button">
                            Delete
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

export default EditPost
