import React, { useContext, useState, useEffect } from 'react';
import '../App.css';
import { NavLink } from 'react-router-dom';
import TaskContext from '../context/TaskContext';
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material';

const Login = () => {

  const context = useContext(TaskContext);
  const { login, setCredentials, credentials, Loading } = context;

  const [errorPopup, setErrorPopup] = useState("");

  const temporarysave = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // HANDLE SUBMIT
  const HandleSubmit = async (e) => {
    e.preventDefault();

    const result = await login();

    if (!result.success) {
      setErrorPopup(result.message);
    }
  };

  // OPTIONAL AUTO CLOSE
  useEffect(() => {
    if (errorPopup) {
      setTimeout(() => setErrorPopup(""), 3000);
    }
  }, [errorPopup]);

  return (
    <>
      {/* 🔥 LOADING */}
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
            <h1>Login to Task Planet</h1>

            <form onSubmit={HandleSubmit}>

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

              <span>
                New user? <NavLink to="/signup">Signup</NavLink>
              </span>

              <button type="submit">Login</button>
            </form>
          </div>

        </div>
      </div>

      {/* 🔥 ERROR POPUP MODAL */}
      {errorPopup && (
        <div
          className="modal-overlay"
          onClick={() => setErrorPopup("")}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "red" }}>Error</h3>

            <p style={{ marginTop: "10px" }}>
              {errorPopup}
            </p>

            <button onClick={() => setErrorPopup("")}>
              Close
            </button>
          </div>
        </div>
      )}

    </>
  );
};

export default Login;