import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom"
import { UserContext } from './UserContext.jsx';
import { supabase } from '../client.js'

const PostDetail = () => {
    // We put the ID of the post in the URL, so we can get it using useParams.
    // This lets us fetch data even if the page is refreshed.
    const { id } = useParams();

    // Store the post details:
    const [post, setPost] = useState(null);

    // Store if the page is loading so we can show a loading screen:
    const [loading, setLoading] = useState(true);

    // Store the generated userID from UserContext:
    const { user } = useContext(UserContext);

    // Store comment details:
    const [comments, setComments] = useState([]);

    // Also store comment input:
    const [commentInput, setCommentInput] = useState("");

    // Store whether the AI is generating a summary:
    const [isGenerating, setIsGenerating] = useState(false);

    // Store the AI-generated summary:
    const [summary, setSummary] = useState("");

    // Increase or decrease the comment's score:
    const voteComment = async (commentID, currentScore, num) => {
        // Update the comment's score locally so the user sees the change
        // immediately:
        setComments(comments.map(comment => 
            comment.id === commentID ? {...comment, score: comment.score + num} : comment
        ));

        // Now we send the update to Supabase and catch any errors:
        const { error } = await supabase
            .from('Comments')
            .update({ score: currentScore + num })
            .eq('id', commentID)
        if (error) {
            console.error('Error updating comment score:', error);
            // If there's an error, revert the local score change:
            setComments(comments.map(comment => 
                comment.id === commentID ? {...comment, score: comment.score - num} : comment
            ));
        }
    }

    // A function to handle submitting a comment:
    const submitComment = async (e) => {
        // Prevent page refresh on form submit:
        e.preventDefault();
        // Insert the new comment into the SupaBase database
        const { data } = await supabase
            .from('Comments')
            .insert({
                postID: id,
                authorID: user.id,
                authorName: user.user_metadata?.username || 'Anon',
                contentText: commentInput
            })
            .select()
            .single();
        // Update the comments locally as well:
        setComments([data, ...comments]);
        setCommentInput("");
    };

    // Use a UseEffect to fetch the SupaBase data for the post using the specific
    // ID in the URL. Run when page loads and when ID changes.
    useEffect(() => {
        setLoading(true);
        const fetchComments = async () => {
            const { data } = await supabase
                .from('Comments')
                .select()
                .eq('postID', id)
                .order('created_at', { ascending: false })
            setComments(data)
            setLoading(false);
        };
        fetchComments();
    }, [id]);

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
            // If there's an error, revert the local score change:
            setPost({...post, score: post.score - num});
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

    // set up the LLM API key and URL from environment variables:
    const LLM_API_KEY = import.meta.env.VITE_LLM_API_KEY;
    const LLM_API_URL = import.meta.env.VITE_LLM_API_URL;

    // Function to call AI and ask it for a summary of the post:
    const callAI = async (e) => {
        e.preventDefault();
        try {
            setIsGenerating(true);
            // Call the LLM:
            const response = await fetch(LLM_API_URL + 'api/v1/messages', {
                    method: "POST",
                    body: JSON.stringify({
                        model: "openai/gemma4:26b", 
                        messages: [
                            {
                                role: "user",
                                content: `You are Professor Oak from the Pokémon world. Summarize the following post and reference the comments' thoughts in 3-5 sentences.
                                        Respond ONLY in JSON format: {"response": "string"}:\n\n
                                        Title: ${post.title}, Type: ${post.type}, Content: ${post.contentText}\n
                                        Comments: \n${comments.map(comment => comment.contentText).join("\n")}`,
                            }
                        ]
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${LLM_API_KEY}`,
                    },
                });
            // Get the response:
            const aiResponse = await response.json();
            console.log('Response from LLM:', aiResponse);
            const rawContent = aiResponse.content ? aiResponse.content[0].text : aiResponse.choices[0].message.content;

            // Clean the response:
            let cleanJson = rawContent.replace(/```json|```/g, "").trim();
            
            // Parse the JSON and set the summary:
            const parsed = JSON.parse(cleanJson);
            setSummary(parsed.response);
        } catch (error) {
            console.error('Error calling AI:', error);
            setSummary("Sorry, there was an error generating the summary. Please try again later.");
        } finally {
            setIsGenerating(false);
        }
    }

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
            {/* LEFT SIDEBAR: Arrows and Score */}
            <div className="post-detail-left-sidebar">
                <button className="post-detail-upvote-button" onClick={() => votePost(post.id, post.score, 1)}>▲</button>
                <p className="post-detail-score">{post?.score}</p>
                <button className="post-detail-downvote-button" onClick={() => votePost(post.id, post.score, -1)}>▼</button>
            </div>

            {/* MAIN COLUMN: Everything else */}
            <div className="post-detail-main-column">
                <button onClick={() => navigate(-1)} className="back-button">← Back</button>

                {post?.authorID === user.id && (
                    <button 
                        className="post-detail-edit-button" 
                        onClick={() => navigate(`/edit/${post.id}`)}
                    >
                        Edit Post
                    </button>
                )}
                
                <div className="post-detail-general-container">
                    <h1 className="post-detail-title">{post?.title}</h1>
                    
                    <div className="post-detail-meta-row">
                        <span className="post-detail-type">{post?.type}</span>
                        <span className="post-detail-author">by {post?.authorName}</span>
                        <span className="post-detail-date">
                            {new Date(post?.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {post?.contentImage && (
                    <div className="post-detail-image-container">
                        <img src={post.contentImage} alt="" className="post-detail-image" />
                    </div>
                )}

                <p className="post-detail-content">{post?.contentText}</p>

                {/* AI summary: */}
                <div className="ai-summary-container">
                    <div className="oak-image-container">
                        <img src="/assets/professor_oak.png" alt="Professor Oak" className="oak-image" />
                    </div>

                    {/* The content container (the speech bubble) */}
                    <div className="oak-speech-bubble">
                        <p className="ai-summary-prompt">Welcome to my lab!</p>
                        
                        {/* Button is inside the bubble; disable it while generating, and while there is a message */}
                        <button 
                            onClick={(e) => callAI(e)} 
                            className="ai-summary-button"
                            disabled={isGenerating || summary}
                        >
                            {isGenerating ? "Checking Notes..." : "Ask for a Summary"}
                        </button>

                        {isGenerating ? (
                            <p className="ai-generating-text">Just a moment, researching the data...</p>
                        ) : summary ? (
                            <div className="ai-summary-text-container">
                                <p className="ai-summary-text">{summary}</p>
                                <p className="oak-signoff">- Professor Oak</p>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="CommentDetail">
                    {/* Comment input */}
                    <div className="comment-input-container">
                        {/* Text box for adding a new comment. Account for empty input */}
                        <form onSubmit={submitComment} className="comment-form">
                            <textarea 
                                placeholder="Join the discussion..." 
                                className="comment-input" 
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                            />
                            <button type="submit" className="comment-submit-button" disabled={commentInput.trim() === ""}>Submit</button>
                        </form>
                    </div>

                    {/* Comment section */}
                    <div className="comment-container">
                        {loading ? (
                            <p className="loading-text">Loading comments...</p>
                        ) : comments && comments.length > 0 ? (
                            comments.map((comment) => {
                                // If comment is null or undefined, don't try to render it
                                if (!comment) return null;

                                return (
                                    <div key={comment.id} className="comment">
                                        <div className="comment-buttons">
                                            <button className="comment-upvote-button" onClick={() => voteComment(comment.id, comment.score, 1)}>▲</button>
                                            <span className="comment-score">{comment.score || 0}</span>
                                            <button className="comment-downvote-button" onClick={() => voteComment(comment.id, comment.score, -1)}>▼</button>
                                        </div>
                                        <div className="comment-general">
                                            
                                            <p className="comment-author">{comment?.authorName}  {new Date(comment?.created_at).toLocaleDateString()}</p>
                                            <p className="comment-content">{comment?.contentText}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="no-comments-text">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetail
