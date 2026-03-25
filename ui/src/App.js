import logo from './logo.svg';
import './App.css';
import AuthorizationPage from './components/AuthorizationPage';
import Login from './components/Login';
import Mainpage from './components/Mainpage';
import { Route,Routes } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Routes>
            <Route path='/' element={<Login />}/>
            <Route path='/signup' element={<AuthorizationPage />}/>
            <Route path='/Mainpage' element={<Mainpage />}/>
          </Routes>
      {/* <Mainpage /> */}
    </div>
  );
}

export default App;



