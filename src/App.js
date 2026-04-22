import './App.css';
import LoginForm from './Component/LoginForm';
import Main from './Component/Main';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  const onClose = () => {
    document.getElementById("commonToaster").style.display = "none";
  };

  return (
    <>
      <div id="commonToaster" className="error-popup" >
        <div className="error-popup-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <p id="commonToasterHeading" className="message"></p>
          <p id="commonToasterBody" className="error-message"></p>
        </div>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard/*" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
