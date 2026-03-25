import React, { useContext, useEffect, useState } from 'react';
import '../App.css';
import TaskContext from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';

const Mainpage = () => {

  const { post, getFeed, createPost, likePost, addComment, postData, setPostData } = useContext(TaskContext);

  const [commentMap, setCommentMap] = useState({});
  const [showLikes, setShowLikes] = useState(null);
  const [showCommentBox, setShowCommentBox] = useState({});

  const navigate = useNavigate();

  // 🔥 PROTECT ROUTE
  useEffect(() => {
    const user = localStorage.getItem("userdetails");

    if (!user) {
      navigate("/");
    } else {
      getFeed();
    }
  }, []);

  // 🔥 SIGNOUT FUNCTION
  const handleSignout = () => {
    localStorage.removeItem("userdetails");
    navigate("/");
  };

  const temporarysave = (e) => {
    const { name, value } = e.target;

    setPostData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = () => {
    if (!postData.text.trim()) return;
    createPost();
  };

  const handleCommentChange = (postId, value) => {
    setCommentMap(prev => ({ ...prev, [postId]: value }));
  };

  const handleShowLikes = (post) => {
    setShowLikes(post);
  };

  const toggleCommentBox = (postId) => {
    setShowCommentBox(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="MainArea">
      <div className="Feed">

        {/* 🔥 NAVBAR */}
        <div className="navbar">
          <h2>Task Planet Social Page</h2>

          <button className="logout-btn" onClick={handleSignout}>
            Sign Out
          </button>
        </div>

        {/* CONTENT */}
        <div className="home-container">

          {/* CREATE POST */}
          <div className="create-card">
            <h3>Create Post</h3>

            <input
              name="text"
              placeholder="What's on your mind?"
              value={postData.text}
              onChange={temporarysave}
            />

            <div className='button-create'>
              <button onClick={handleCreate}>Post</button>
            </div>
          </div>

          {/* POSTS */}
          {post?.length > 0 ? (
            post.map((item, index) => {

              if (!item) return null;

              const user = JSON.parse(localStorage.getItem("userdetails"));
              const userId = user?.id;

              const isLiked = item.likes?.some(
                (id) =>
                  id && id._id
                    ? id._id.toString() === userId
                    : id && id.toString() === userId
              );

              return (
                <div key={item._id || index} className="post-card">

                  {/* USER */}
                  <div className="post-header">
                    <div className="profile-circle">
                      {item?.userId?.name?.[0] || "U"}
                    </div>
                    <h4>{item?.userId?.name || "User"}</h4>
                  </div>

                  {/* CONTENT */}
                  {item?.text && <p>{item.text}</p>}
                  {item?.image && <img src={item.image} alt="post" />}

                  {/* ACTIONS */}
                  <div className="post-actions">
                    <span
                      onClick={() => handleShowLikes(item)}
                      style={{ cursor: "pointer" }}
                    >
                      ❤️ {item?.likes?.length || 0}
                    </span>

                    <span>💬 {item?.comments?.length || 0}</span>
                  </div>

                  {/* BUTTONS */}
                  <div className="post-buttons">

                    <button
                      className="LikeButton"
                      onClick={() => likePost(item._id)}
                    >
                      {isLiked ? "❤️ Liked" : "🤍 Like"}
                    </button>

                    <button
                      className="CommentButton"
                      onClick={() => toggleCommentBox(item._id)}
                    >
                      💬 Comment
                    </button>

                  </div>

                  {/* COMMENTS */}
                  <div className="comments">
                    {item?.comments?.length > 0 ? (
                      item.comments.map((c, i) => (
                        <p key={i}>
                          <b>{c?.userId?.name || "User"}:</b> {c?.text || ""}
                        </p>
                      ))
                    ) : (
                      <p>No comments</p>
                    )}
                  </div>

                  {/* COMMENT INPUT */}
                  {showCommentBox[item._id] && (
                    <div className="comment-box">

                      <input
                        className="comment-input"
                        placeholder="Write a comment..."
                        value={commentMap[item._id] || ""}
                        onChange={(e) =>
                          handleCommentChange(item._id, e.target.value)
                        }
                      />

                      <button
                        className="comment-submit"
                        onClick={() => {
                          addComment(item._id, commentMap[item._id] || "");
                          setCommentMap(prev => ({ ...prev, [item._id]: "" }));
                          setShowCommentBox(prev => ({ ...prev, [item._id]: false }));
                        }}
                      >
                        Post
                      </button>

                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No posts available 🚀
            </p>
          )}

        </div>
      </div>

      {/* LIKE MODAL */}
      {showLikes && (
        <div
          className="modal-overlay"
          onClick={() => setShowLikes(null)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Liked by</h3>

            {showLikes.likes?.length > 0 ? (
              showLikes.likes.map((user, index) => (
                <p key={index}>
                  {user?.name || user?._id || user}
                </p>
              ))
            ) : (
              <p>No likes yet</p>
            )}

            <button onClick={() => setShowLikes(null)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Mainpage;