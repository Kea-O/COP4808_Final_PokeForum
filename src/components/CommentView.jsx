import { useState, useEffect } from 'react';

const CommentView = (id, userID) => {
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
        await supabase
            .from('Comments')
            .insert({
                postID: id,
                authorID: userID,
                authorName: 'Anon',
                contentText: commentInput
            });
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
                .order('created_at', { ascending: true })
            setComments(data)
        };
        fetchComments();
        setLoading(false);
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
                    comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <div className="comment-general">
                                <p className="comment-author">{comment.userID}</p>
                                <p className="comment-date">{comment.created_at}</p>
                                <p className="comment-content">{comment.contentText}</p>
                            </div>
                            <div className="comment-buttons">
                                <button className="comment-upvote-button" onClick={() => voteComment(comment.id, comment.score, 1)}>↑</button>
                                <button className="comment-downvote-button" onClick={() => voteComment(comment.id, comment.score, -1)}>↓</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-comments-text">No comments yet. Be the first to comment!</p>
                )}
             </div>
         </div>
    );
}

export default CommentView
