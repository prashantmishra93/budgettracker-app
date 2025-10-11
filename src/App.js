import './App.css';
import { url } from './helper/api_helper';
import LoginForm from './Component/LoginForm';
import Main from './Component/Main';

function App() {
  const token = localStorage.getItem(url.USER_TOKEN)
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
      {token ? (
        <Main />
      ) : (
        <LoginForm />
      )}
    </>
  );
}

export default App;
