import React, { useState } from 'react';
import TaskContext from './TaskContext';
import { useNavigate } from 'react-router-dom';

const TaskState = (props) => {
    let navigate=useNavigate();
    const [Loading, setLoading] = useState(false);
    const [user, SetUser] = useState([]);

    const initial = { username: "", email: "", password: "", cpassword: "" };
    const [credentials, setCredentials] = useState(initial);
    const host="https://taskplanetsocial-pxj5.onrender.com";
    // login api 
    const login = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${host}/auth/validateUser/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                }),
            });
    
            const json = await response.json();
            console.log(json);
    
            if (json.success) {
                setCredentials(initial);
                SetUser(json.user);
                localStorage.setItem('userdetails', JSON.stringify(json.user));
                navigate("/Mainpage/");
    
                return { success: true }; // ✅ IMPORTANT
            } else {
                setCredentials({ ...credentials, password: "" });
    
                return {
                    success: false,
                    message: json.error || "Wrong password"
                };
            }
    
        } catch (error) {
            console.error(error);
    
            return {
                success: false,
                message: "Server error"
            };
    
        } finally {
            setLoading(false); 
        }
    };

    // SIGNUP
    const signup = async () => {
        setLoading(true);
    
        try {
            if (credentials.password !== credentials.cpassword) {
                setLoading(false);
                setCredentials({ ...credentials, password: "", cpassword: "" });
                return;
            }
    
            const response = await fetch(`${host}/auth/Validateuser/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: credentials.username,
                    email: credentials.email,
                    password: credentials.password
                }),
            });
    
            const json = await response.json();
    
            if (json.success) {
                setCredentials(initial);
                navigate("/");
            } else {
                console.log("Signup failed:", json);
            }
    
        } catch (error) {
            console.error("Signup error:", error);
        } finally {
            
            setLoading(false);
        }
    };
    //Get all posts
    const [post,setPost]=useState([]);
    const getFeed=async ()=>{
        setLoading(true);
        try{
        const response = await fetch(`${host}/auth/Posts/getAllPosts`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
          });
          const feed = await response.json();
          console.log("API Response:", feed);
  
          if (feed.success) {
              setPost(feed.posts);
          } else {
              console.log("Failed to fetch posts");
          }
            
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false); 
            }    
    }
    const init = { text:"",image:""};
    const [postData, setPostData] = useState(init);
    //create a post
    const createPost = async () => {
        setLoading(true);
    
        try {
            const user = JSON.parse(localStorage.getItem("userdetails"));
            console.log(user)
            const response = await fetch(`${host}/auth/Posts/createPost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: postData.text,
                    image: postData.image,
                    userId: user.id
                }),
            });
    
            const json = await response.json();
    
            if (json.success) {
                setPost((prev) => [json.post, ...prev]);
                setPostData({ text: "", image: "" }); 
            }
    
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const likePost = async (postId) => {
        try {
            const user = JSON.parse(localStorage.getItem("userdetails"));
            const userId = user.id;
    
            const response = await fetch(`${host}/auth/Posts/${postId}/like`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId })
            });
    
            const data = await response.json();
    
            if (data.success) {
                setPost((prevPosts) =>
                    prevPosts.map((p) =>
                        p._id === postId
                            ? { ...p, likes: data.likes } // ✅ backend source
                            : p
                    )
                );
            }
    
        } catch (error) {
            console.error(error);
        }
    };

    //add comment
    const addComment = async (postId, text) => {
        if (!text.trim()) return;
    
        try {
            const user = JSON.parse(localStorage.getItem("userdetails"));
    
            const response = await fetch(`${host}/auth/Posts/${postId}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user._id,
                    text
                })
            });
    
            const data = await response.json();
    
            if (data.success) {
                setPost((prevPosts) =>
                    prevPosts.map((p) =>
                        p._id === postId
                            ? { ...p, comments: data.comments }
                            : p
                    )
                );
            }
    
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <TaskContext.Provider value={{addComment,likePost,createPost,postData,setPostData, getFeed,post,credentials,Loading, user, setCredentials, login, signup }}>
            {props.children}
        </TaskContext.Provider>
    );
};

export default TaskState;