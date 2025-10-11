import React, { useState } from "react";
import { makeApiRequest, url, showMessage } from "../helper/api_helper";

export default function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await makeApiRequest(url.USER_API.register, formData, url.API_EXTENSION);
      setMessage("Registration successful");
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setMessage("Registration failed");
    }
  }

  return (
    <div>
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
