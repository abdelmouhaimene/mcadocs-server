import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
    login() {
        return {msg : "Login successful!"};
    }
    signup() {
        return {msg : "Signup successful!"};
    }
    logout() {}
}