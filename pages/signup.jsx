import React, { useState } from "react";
import Link from "next/link";
import { validate, validateProperty } from "../models/user";
import { toast, ToastContainer } from "react-toastify";
import axios from "../services/httpService"
import {
    apiUrl
} from "../config.json"
import "react-toastify/dist/ReactToastify.css";
export default function Signup() {
    const [user, setUser] = useState({
        username: "",
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
        e.preventDefault();
        const errorsCopy = validate(user);
        setErrors(errorsCopy);
        if (errorsCopy) return;
        axios.post(apiUrl + "/user/register", user).then((response) => {
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
                                            style={{ width: "150px", textAlign: "center" }}
                                        >
                                            Create account
                                        </p>
                                    </div>
                                    <form className="mt-4" onSubmit={handleSubmit}>
                                        <div className="mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="username"
                                                value={user.username}
                                                onChange={handleChange}
                                                placeholder="User Name"
                                            />
                                            {errors && errors.username && (
                                                <div className="form-text" style={{ color: "red" }}>
                                                    {errors.username}
                                                </div>
                                            )}
                                        </div>
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
                                                Sign Up
                                            </button>
                                        </div>
                                    </form>
                                    <div className="row mt-4">
                                        <div className="col text-center">
                                            <Link href="/login">Already have account?</Link>
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


export async function getServerSideProps(context) {
    try {
        const user = context.req.cookies.user
            ? JSON.parse(context.req.cookies.user)
            : null;
        if (user) {
            return {
                redirect: {
                    destination: "/",
                },
            };
        }
        return {
            props: {},
        };
    } catch (error) {
        return {
            props: {
                user: null,
            },
        };
    }
}