import React, { useContext, useState } from 'react';
import '../App.css';
import { NavLink } from 'react-router-dom';
import TaskContext from '../context/TaskContext';
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material';
const AuthorizationPage = () => {

  const context=useContext(TaskContext);
  const {signup,setCredentials,credentials,Loading}=context;
  const temporarysave=(e)=>{
      e.preventDefault();
      setCredentials({...credentials,[e.target.name]:e.target.value});
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    signup();
  };

  return (
    <>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={Loading}
    >
        <CircularProgress color="inherit" />
    </Backdrop>
    <div className='MainArea'>
      <div className="signup-container">

        {/* LEFT */}
        <div className="signup-left">
          <img
            src="https://play-lh.googleusercontent.com/Z5aOARn89MpGrTp_GeVe5tnT-2YgD15I8drTOEzim_6ncc9wQN9O0xjr8-uLa6o7Dw=w600-h300-pc0xffffff-pd"
            alt="logo"
          />
        </div>

        {/* RIGHT */}
        <div className="signup-right">
          <h1>Signup to Task Planet</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              onChange={temporarysave}
              value={credentials.username}
              placeholder="Username"
            />

            <input
              type="email"
              name="email"
              onChange={temporarysave}
              value={credentials.email}
              placeholder="Email"
            />

            <input
              type="password"
              name="password"
              onChange={temporarysave}
              value={credentials.password}
              placeholder="Password"
            />

            <input
              type="password"
              name="cpassword"
              onChange={temporarysave}
              value={credentials.cpassword}
              placeholder="Confirm Password"
            />

            <span>
              Already a user? <NavLink to="/">Login</NavLink>
            </span>

            <button type="submit">Signup</button>
          </form>
        </div>

      </div>
    </div>
    </>
  );
};

export default AuthorizationPage;