import React, { useState } from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/globals.css";
import '../styles/auth.css'
import App from "next/app";
import { AppStore } from "../store/AppStore";
function MyApp({ Component, pageProps: { userinfo, ...pageProps } }) {
  const [user, setUser] = useState(userinfo);
  const setUSER = (user) => {
    Cookies.set("user", JSON.stringify(user));
    setUser(user);
  };
  const logout = () => {
    Cookies.remove("user");
    setUser(null);
  };
  const authUser = () => {
    let jwt=userinfo;
    try {
      return jwtDecode(jwt);
    } catch (ex) {
      return null
    }
  }
  return (
    <AppStore.Provider
      value={{
        setUSER,
        authUser,
        user,
        logout,
      }}
    >
      <Component {...pageProps} />;
    </AppStore.Provider>
  );
}
export default MyApp;
MyApp.getInitialProps = async (context) => {
  const pageProps = await App.getInitialProps(context);
  let userinfo;
  try {
    userinfo = context.ctx.req.cookies.user
      ? JSON.parse(context.ctx.req.cookies.user)
      : null;
  } catch (error) {
    userinfo = null;
  }
  return { pageProps: { userinfo, ...pageProps } };
};
