import React, { useState, useEffect } from 'react'
import UserContext from './UserContext';

const UserState = (props)=>{

    const initialFetchItems = {};
    const [user, setUser] = useState(initialFetchItems);


    const LoginHelper = async (userData) => {
        // preparing url 
        // eslint-disable-next-line no-undef
        let url = `${import.meta.env.VITE_BACKEND_URL}/User/userlogin`;

        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData?.email,
            password: userData?.password,
          })
        })
  
        const jsonResp = await response.json()
        console.log("register response");
  
        if (jsonResp.signal === 'green') {
          // set usertoken in localstorage
          localStorage.setItem('usertoken',jsonResp.usertoken);

          // set user info to show in dashboard
          setUser(jsonResp.userData);

          // login successful
          return true;
        }
  
        // login unsuccessful
        return false;
    }

    const RegisterHelper = async (userData) => {
      // preparing url 
      // eslint-disable-next-line no-undef
      let url = `${import.meta.env.VITE_BACKEND_URL}/User/createuser`;

      // preparing formData object 
      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('contact_num', userData.contact_num);
      formData.append('image', userData.profileImage);

      // sending request
      const response = await fetch(url, {
        method: "POST",
        body: formData
      })

      // converting to json form
      const jsonResp = await response.json()
      console.log("register response", jsonResp);

      if (jsonResp.signal === 'green') {
        // tells that registeration is successful
        return true;
      }

      // registration failure
      return false;
    }

    useEffect(() => {
        // send fetch reqeust and set data to state
    });
    
    return (
        <UserContext.Provider value={{ user, LoginHelper, RegisterHelper }}>
          {props.children}
        </UserContext.Provider>
      )
}

export default UserState;