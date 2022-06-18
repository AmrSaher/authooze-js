export default class Token {
    constructor() {
        return this;
    }

    setToken(token) {
        this.token = localStorage.setItem('token', token.split('|')[1]);
        return this.token;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    removeToken() {
        localStorage.removeItem('token');
    }
}