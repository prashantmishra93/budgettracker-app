import React, { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import login_page from '../assets/Images/login_page.jpg'
import { makeApiRequest, url, showMessage, respStatus } from "../helper/api_helper";

import { 
    MDBContainer, 
    MDBCol, 
    MDBRow, 
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
} from 'mdb-react-ui-kit';

const LoginForm = ({ onLogin }) => {
    const navigate = useNavigate();
    const initLog = {
        username : '',
        password : '',
    }
    const initReg = {
        'username' : '',
        'email' : '',
        'password' : '',
    }
  const [justifyActive, setJustifyActive] = useState('login');
  const [loginData, setLoginData] = useState(initLog)
  const [registerData, setRegisterData] = useState(initReg);

  const inputChangeHandler = (e) => {
    if(justifyActive === 'login') {
      setLoginData({
          ...loginData,
          [e.target.name] : e.target.value
      })
    }
    else {
      setRegisterData({
          ...registerData,
          [e.target.name] : e.target.value
      })
    }
  }
  
  const loginHandler = async (e) => {
    e.preventDefault();
    try {
        const response = await makeApiRequest(url.USER_API.login, loginData, url.API_EXTENSION);
        if(response) {
          if (response?.status !== respStatus['SUCCESS']) {
            showMessage(response);
            return
          }
          localStorage.setItem(url.USER_TOKEN, response?.data?.access);
          Swal.fire({
            title: 'Login Success..',
            text: "Doctor Login Successfully..",
            icon: 'success', 
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes!'
          })
          .then((result) => {
            if (result.isConfirmed) {
              navigate('/dashboard');
              window.location.reload()
            }
          });
        }
    } catch (error) {
        showMessage(error, "error", "error")
    }
  }

  
  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await makeApiRequest(url.USER_API.register, registerData, url.API_EXTENSION);
      if(response) {
        if (response.status !== respStatus['SUCCESS']) {
          showMessage(response);
          return
        }
        Swal.fire({
          title: 'Registration Success..',
          text: "Doctor Register Successfully..",
          icon: 'success', 
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Yes!'
        })
        .then((result) => {
          if (result.isConfirmed) {
            window.location.reload()
          }
        });
      }
    } catch (error) {
      showMessage(error, "error", "error")
    }
  }
  
  const handleJustifyClick = (value) => {
    setJustifyActive(value);
    setLoginData(initLog)
    setRegisterData(initReg)
  };
  
    return (
        <>
            <MDBContainer fluid className="p-3 my-5 h-custom">
                <MDBRow>
                    <MDBCol col='10' md='6'>
                        <img src={login_page} className="img-fluid" alt="Sample images" />
                    </MDBCol>
                    <MDBCol col='4' md='6'>
                        <MDBTabs pills justify className='mb-3 m-4 d-flex flex-row justify-content-between'>
                            <MDBTabsItem>
                                <MDBTabsLink onClick={() => handleJustifyClick('login')} active={justifyActive === 'login'}>
                                    Login
                                </MDBTabsLink>
                            </MDBTabsItem>
                            <MDBTabsItem>
                                <MDBTabsLink onClick={() => handleJustifyClick('register')} active={justifyActive === 'register'}>
                                    Register
                                </MDBTabsLink>
                            </MDBTabsItem>
                        </MDBTabs>

                        <MDBTabsContent>

                            <div className={justifyActive === 'login' ? 'tab-pane active m-4' : 'tab-pane m-4'}>
                                <form onSubmit={loginHandler} method='POST'>
                                    <div className="form-group">
                                        <input type="text" className="form-control" id="exampleInputEmail1"
                                        name="username" onChange={inputChangeHandler} value={loginData.username}
                                        placeholder="Enter Username" />
                                    </div>
                                    <br/>
                                    <div className="form-group">
                                        <input type="password" className="form-control" id="exampleInputPassword1"
                                        name="password" onChange={inputChangeHandler} value={loginData.password}
                                        autoComplete='false'
                                        placeholder="Password" />
                                    </div>
                                    <br/>
                                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                                </form>
                                <p className="text-center">Not a member? <a href="#!" onClick={() => handleJustifyClick('register')}>Register</a></p>
                            </div>

                            <div className={justifyActive === 'register' ? 'tab-pane active m-4' : 'tab-pane m-4'}>
                                <form onSubmit={registerHandler} method="POST">
                                    <div className="form-group">
                                        <input type="text" className="form-control" id="exampleInputName"
                                        name="username" onChange={inputChangeHandler} value={registerData.username}
                                        placeholder="Enter Username" />
                                    </div>
                                    <br/>
                                    <div className="form-group">
                                        <input type="email" className="form-control" id="exampleInputEmail"
                                        name="email" onChange={inputChangeHandler} value={registerData.email}
                                        placeholder="Enter email" />
                                    </div>
                                    <br/>
                                    <div className="form-group">
                                        <input type="password" className="form-control" id="exampleInputPassword1"
                                        name="password" onChange={inputChangeHandler} value={registerData.password}
                                        autoComplete='false'
                                        placeholder="Password" />
                                    </div>
                                    <br/>
                                    <button type="submit" className="btn btn-primary submit-btn">Sign up</button>
                                </form>
                            </div>
                        </MDBTabsContent>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    )
}

export default React.memo(LoginForm)
