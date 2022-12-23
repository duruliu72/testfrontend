import React, { useState, useContext } from "react";
import Link from "next/link";
import { loginValidate, validateProperty } from "../models/user";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import { apiUrl } from "../config.json";
import http from "../services/httpService"
import { useRouter } from "next/router";
import { AppStore } from "../store/AppStore";
export default function Login() {
  const router = useRouter();
  const { setUSER, authUser } = useContext(AppStore);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    var errorsCopy = { ...errors };
    const errorMessage = validateProperty(e.currentTarget);
    if (errorMessage) errorsCopy[e.currentTarget.name] = errorMessage;
    else delete errorsCopy[e.currentTarget.name];
    setErrors(errorsCopy);
    let userCopy = { ...user };
    userCopy[e.currentTarget.name] = e.currentTarget.value;
    setUser(userCopy);
  };
  const handleSubmit = (e) => {
    console.log("handle");
    e.preventDefault();
    const errorsCopy = loginValidate(user);
    setErrors(errorsCopy);
    if (errorsCopy) return;
    http.post(apiUrl + "/user/auth", user).then((response) => {
      if (response.data.appStatus) {
        setUSER(response.data.appData);
        http.setJwt(response.data.appData);
        router.push("/");
      }
      toast(response.data.appMessage);

    }).catch(ex => {
      console.log(ex);
    });
  };
  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-12">
            <div className="sign-up-section">
              <div className="sign-up__card">
                <div className="sign-up__card-body">
                  <div className="mt-4">
                    <p
                      className="login-em"
                      style={{ width: "100px", textAlign: "center" }}
                    >
                      Login with
                    </p>
                  </div>
                  <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mb-2">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Email"
                      />
                      {errors && errors.email && (
                        <div className="form-text" style={{ color: "red" }}>
                          {errors.email}
                        </div>
                      )}
                    </div>
                    <div className="mb-2">
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        placeholder="Password"
                      />
                      {errors && errors.password && (
                        <div className="form-text" style={{ color: "red" }}>
                          {errors.password}
                        </div>
                      )}
                    </div>
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="exampleCheck1"
                      />
                      <label className="form-check-label" htmlFor="exampleCheck1">
                        Check me out
                      </label>
                    </div>
                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-primary">
                        Login
                      </button>
                    </div>
                  </form>
                  <div className="row mt-4">
                    <div className="col-7">
                      <Link href="/"> Forgot your password?</Link>
                    </div>
                    <div className="col-5 text-right">
                      <Link href="/signup">Create an account</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
}
