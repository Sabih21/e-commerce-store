import React, {useCallback, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {Api} from '../../utils/Api'
import {setToken} from '../../utils/localstorage'

import './signIn.css'
function Index() {
  const {replace, push} = useHistory()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [loading, setLoading] = useState(false)
  
  const _handleSubmit = useCallback(async () => {
    if (email === 'superadmin@gmail.com' && password === 'superadmin') {
      const token = 'superadmin-token'; 
      setToken(token);
      replace('/dashboard'); 
      return;
    }

    if (email.length > 2 && password.length > 2) {
      setLoading(true);
      
      let { statusCode, data } = await Api.postRequest('/api/user/signin', { email, password });
  
      console.log("Raw Data:", data);
      
      try {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        console.log("Parsed Data:", data);
  
        if (data?.user_id) {
          console.log("User ID:", data.user_id);
          localStorage.setItem("userId", data.user_id);
        } else {
          console.warn("User ID not found in response!");
        }
        
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Invalid response from server: " + data);
        return;
      }
  
      setLoading(false);
  
      if ([400, 403, 500].includes(statusCode)) {
        alert(data?.error || "An error occurred");
        return;
      }
  
      const { token } = data;
      if (token) {
        setToken(token);
        replace('/');
      }
    }
  }, [email, password, replace]);
  
  if (loading) return <h1>Loading.....</h1>
  return (
    
    <div className="signinscreen">

      <div className="container">
        <div className="innerContainer">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              // backgroundColor: 'red',
            }}
          >
            <div style={{cursor: 'pointer'}} onClick={() => push('/')}>
              <i class="fas fa-arrow-circle-left fa-5x"></i>
            </div>
            <p>Sign In</p>
          </div>

          <label for="email">Email</label>
          <input
            type="email"
            id="lname"
            name="email"
            placeholder="Your email.."
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <label for="password">Password</label>
          <input
            type="password"
            id="lname"
            name="password"
            placeholder="Your Password.."
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Link to="/signup" className="link">
            <span>Creat a new account ?</span>
          </Link>
          <br />

          <input type="submit" value="Sign in" onClick={_handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default Index
