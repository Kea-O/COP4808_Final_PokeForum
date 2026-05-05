import { useContext, useState, useEffect } from 'react'
import { Link } from "react-router"
import { supabase } from './client.js'
import { UserContext } from './components/UserContext'
import './App.css'

function App() {
  // Store received posts in state:
  const [posts, setPosts] = useState([]);

  // check if the site is loading data:
  const [loading, setLoading] = useState(true);

  // Store the user object from UserContext:
  const { user } = useContext(UserContext);

  // Filter posts based on a search query. This will contain two values:
  // text for the title, and the type of post (discussion, question, etc).
  const [searchQuery, setSearchQuery] = useState({
    title: "",
    type: ""
  });

  // Different types of posts to filter by:
  const postTypes = ["Discussion", "Question", "News", "Other"];

  // Variable that will contain the filtered results. Account for the type
  // value being empty, which means we want all types.
  const filteredPosts = posts?.filter(post => {
    return (
      post?.title?.toLowerCase().includes(searchQuery.title.toLowerCase()) &&
      (searchQuery.type ? post?.type === searchQuery.type : true)
    );
  });

  // Have a variable that stores how we'll sort the posts. Use a default
  // value because sortBy isn't given a value when useEffectfirst runs.
  const [sortBy, setSortBy] = useState("created_at");

  // Store if we want the return to be ascending or descending:
  const [isAscending, setIsAscending] = useState(false);

  // A trigger to show a "login" button or "logout" button depending on if the user is logged in or not.
  const [loggedIn, setLoggedIn] = useState(user !== null);

  // Function for users to log in and logout:
  const logout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
  }

  // UseEffect to get data from SupaBase and fill in the posts variable. 
  // Will run once when the page loads and any time the sorting choices change.
  // Starts with newest first by default.
  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('Posts')
        .select('id, created_at, title, type, authorName, score')
        .order(sortBy, { ascending: isAscending })
      setPosts(data)
      setLoading(false);
    };
    fetchPosts();
  }, [sortBy, isAscending]);

  return (
    <div className="App">
      {/* Login/Singout button */}
      <div className="login-container">
        {loggedIn ? (
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        ) : (
          <Link to="/login" className="login-button">
            Sign Up
          </Link>
        )}
      </div>

      {/* Title */}
      <div className="title-container">
        <div className="title-pokeball">
          <h1 className="title">Poké</h1>
          <img src="assets/pokeball.png" alt="Pokeball" className="pokeball-image" />
          <h1 className="title">Forum!</h1>
        </div>
        <p className="subtitle">A user-centered forum for all things Pokémon!</p>
      </div>

      {/* Button to create a new post */}
      <Link to="/create" className="create-post-button">
        Create Post
      </Link>

      {/* Search Inputs */}
      <div className="search-container">
        <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery.title}
            onChange={(e) => setSearchQuery({ ...searchQuery, title: e.target.value })}
            className="search-title-input"
          />

        <label className="sort-text">Choose Post Type:</label>
        <select onChange={(e) => setSearchQuery({ ...searchQuery, type: e.target.value })}>
          <option value="">--Select a Type--</option>
          {postTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <label className="sort-text">Sort By :</label>
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="created_at">Date</option>
          <option value="score">Score</option>
        </select>
        <button onClick = {() => setIsAscending(!isAscending)} className="sort-button">
          {isAscending ? '↑' : '↓'}
        </button>
      </div>
      
      {/* Filtered Posts */}
      <div className="post-container">
        {loading ? (
          <p className="loading-text">Loading posts...</p>
        ) : posts?.length > 0 ? (
          <div className="post-list">
            {filteredPosts?.length > 0 ? (
              filteredPosts.map(post => (
                <Link to={`/post/${post.id}`} key={post.id} className="post-link">
                  <div key={post.id} className="post">
                    <h2 className="post-title">{post.title}</h2>
                    <div className="post-info-container">
                      <p className="post-score">{post.score}</p>
                      <p className="post-type">{post.type}</p>
                      <p className="post-author">{post.authorName}</p>
                      <p className="post-date">{new Date(post.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-results">No posts found matching your criteria.</p>
            )}
          </div>
        ) : (
          <p className="no-posts">No posts found. Create one to get started!</p>
        )}
      </div>
    </div>
  )
}

export default App
