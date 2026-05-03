import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom"
import { UserContext } from './UserContext';
import CommentView from './CommentView';

const PostDetail = () => {
    // We put the ID of the post in the URL, so we can get it using useParams.
    // This lets us fetch data even if the page is refreshed.
    const { id } = useParams();

    // Store the post details:
    const [post, setPost] = useState(null);

    // Store if the page is loading so we can show a loading screen:
    const [loading, setLoading] = useState(true);

    // Store the generated userID from UserContext:
    const userID = useContext(UserContext);

    // Increase or decrease the post's score:
    const votePost = async (postID, currentScore, num) => {
        // Update the post's score locally so the user sees the change
        // immediately:
        setPost({...post, score: post.score + num});

        // Now we send the update to Supabase and catch any errors:
        const { error } = await supabase
            .from('Posts')
            .update({ score: currentScore + num })
            .eq('id', postID)
        if (error) {
            console.error('Error updating post score:', error);
        }
    }

    // Use a UseEffect to fetch the SupaBase data for the post using the specific
    // ID in the URL. Run when page loads and when ID changes.
    useEffect(() => {
        setLoading(true);
        const fetchPost = async () => {
            const { data } = await supabase
                .from('Posts')
                .select()
                .eq('id', id)
                .single()
            setPost(data)
            setLoading(false);
        };
        fetchPost();
    }, [id]);

    // I can use useNavigate() to easily go forward or backwards in browser history.
    const navigate = useNavigate();

    // If data is loading up, show the loading screen
    if (loading) {
        return <div className="loading-container"><h1>Loading post...</h1></div>;
    }

    // If we can't find a post with the ID, show an error message.
    if (!post) {
        return <div className="error-container"><h1>Post not found!</h1><button onClick={() => navigate('/')}>Go Home</button></div>;
    }

    // If we can find a post, show the post details:
    return (
        <div className="PostDetail">
            <button onClick={() => navigate(-1)} className="back-button">← Back</button>

            {/* General Post Info (title, type, author) */}
            <div className="post-detail-container">
                <div className="post-detail-general-container">
                    <p className="post-detail-title">{post?.title}</p>
                    <p className="post-detail-date">Created: {post?.created_at}</p>
                    <p className="post-detail-type">{post?.type}</p>
                    <p className="post-detail-author">By {post?.authorName}</p>
                    <p className="post-detail-score">Score: {post?.score}</p>

                    {/* Buttons to increase or decrease the post's score: */}
                    <div className="post-detail-buttons">
                        <button className="post-detail-upvote-button" onClick={() => votePost(post.id, post.score, 1)}>↑</button>
                        <button className="post-detail-downvote-button" onClick={() => votePost(post.id, post.score, -1)}>↓</button>
                    </div>

                    {/* Edit Link. Check if the user's ID matches the post's author ID. */}
                    {post?.authorID === userID && (
                        <button className="post-detail-edit-button" onClick={() => navigate(`/edit/${post.id}`)}>
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {/* An image, if the post has one */}
            {post?.contentImage && (
                <div className="post-detail-image-container">
                    <img src={post.contentImage} alt={post.title} className="post-detail-image" />
                </div>
            )}

            {/* The main content of the post */}
            {post?.contentText && (
                <div className="post-detail-content-container">
                    <p className="post-detail-content">{post?.contextText}</p>
                </div>
            )}

            {/* Comment section */}
            <CommentView id = {post?.id} userId = {userID} />
        </div>
    );
}

export default PostDetail
