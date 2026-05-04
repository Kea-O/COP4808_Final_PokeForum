import { useState, useEffect } from 'react';
import { supabase } from '../client'

const CommentView = ({id, userID, authorName}) => {
    // Store comment details:
    const [comments, setComments] = useState([]);

    // Also store comment input:
    const [commentInput, setCommentInput] = useState("");

    // Use a loading variable to show a loading screen while waiting for data.
    const [loading, setLoading] = useState(true);

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
        }
    }

    // A function to handle submitting a comment:
    const submitComment = async (e) => {
        // Prevent page refresh on form submit:
        e.preventDefault();
        // Insert the new comment into the SupaBase database
        const {data} = await supabase
            .from('Comments')
            .insert({
                postID: id,
                authorID: parseInt(userID),
                authorName: 'Anon',
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

    return (
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
                {comments && comments.length > 0 ? (
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
    );
}

export default CommentView
