import jwtDecode from "jwt-decode";
import http from "./httpService";
import { apiUrl } from "../config.json";
const tokenKey = "token";
export async function login(email, password) {
    const { data: jwt } = await http.post(apiUrl + "/user/auth", { email, password });
    return jwt
}
export default {
    login,
};