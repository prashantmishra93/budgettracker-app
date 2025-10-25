import React from 'react'
import { useNavigate } from 'react-router';

function NotFound() {
  const navigate = useNavigate()
  const tokenCheck = localStorage.getItem('token')
  if(tokenCheck) {
    navigate('/dashboard')
  }
  return (
    <div className="page-not-found">
        <h1>404 Page Not Found..</h1>
    </div>
  )
}

export default React.memo(NotFound)
