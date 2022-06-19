import Request from './Request';
import Token from './Token';
import axios from 'axios';

export default class App {
    constructor () {
        // set axios base url and auth links if configured and connected to backend
        this.READY_BACKEND = "http://127.0.0.1:8000/api";
        this.token = new Token();
        this.request = new Request();
    }

    setConfig(options) {
        if (!this.#testConfigrations(options)) return;
        this.configratoins = options || {};
        this.router = this.configratoins.router;
        this.store = this.configratoins.store.store;
        this.authLinks = this.request.chooseHandler(this.configratoins, this.READY_BACKEND);
        this.#createMiddlewares();
        return this;
    }

    #testConfigrations(options) {
        // error if not configured or not connected to backend
        try {
            let configrations = (options.api ? 
            [options.api.url, options.api.links] : 
            [options.APP_SECRET_KEY, options.APP_NAME]);
            let router = options.router;
            let store = options.store;
        } catch (e) {
            console.error("Please, complete the configrations.");
            return false;
        }
        return true;
    }

    #createMiddlewares() {
        // create middlewares for vue router
        this.router.router.beforeEach((to, from, next) => {
            let middleware = to.meta.middleware;
            if (!middleware) next();
            if (middleware.includes('auth')) {
                if (!this.checkAuthed()) next(this.router.redirects.login);
            } else if (middleware.includes('guest')) {
                if (this.checkAuthed()) next(this.router.redirects.home);
            }
            next();
        });
    }

    mainTest() {
        // error if not configured or not connected to backend or not connected to router
        try {
            this.#testConfigrations(this.configratoins);
        } catch (e) {
            console.error("Check configrations, router or store.");
            return false;
        }
        return true;
    }

    async register(data) {
        if (!this.mainTest()) return;
        let response = await this.request.sendRequest("post", "http://127.0.0.1:8000/api/register", this.configratoins.APP_SECRET_KEY ? {...data, secret_key: this.configratoins.APP_SECRET_KEY} : data);
        if (response.success) this.getUser();
        return this.#clientLogin(response);
    }

    async login(data) {
        if (!this.mainTest()) return;
        let response = await this.request.sendRequest("post", "http://127.0.0.1:8000/api/login", this.configratoins.APP_SECRET_KEY ? {...data, secret_key: this.configratoins.APP_SECRET_KEY} : data);
        if (response.success) this.getUser();
        return this.#clientLogin(response);
    }

    async logout() {
        if (!this.mainTest()) return;
        let response = await this.request.sendRequest("post", this.authLinks.logout, {}, {
            Authorization: `Bearer ${this.token.getToken()}`
        })
        if (response.success) this.#clientLogout();
    }

    checkAuthed() {
        if (!this.mainTest()) return;
        return this.token.getToken() ? (this.getUser() ? true : false) : false;
    }

    async deleteAccount() {
        if (!this.mainTest()) return;
        let response = await this.request.sendRequest("delete", this.authLinks.deleteAccount, {}, {
            Authorization: `Bearer ${this.token.getToken()}`
        });
        if (response.success) this.#clientLogout();
    }

    async getUser() {
        if (!this.mainTest()) return;
        if ((!localStorage.getItem('user') || typeof localStorage.getItem('user') == "undefined")
            && this.token.getToken()) {
            let response = await this.request.sendRequest("get", this.authLinks.user, {}, {
                Authorization: `Bearer ${this.token.getToken()}`
            });
            if (response.success) {
                this.store.state.user = response.data;
                localStorage.setItem("user", JSON.stringify(response.data));
                return true;
            }
            return false;
        } else {
            this.store.state.user = this.token.getToken() ? 
            JSON.parse(localStorage.getItem('user')) : 
            this.store.state.user;
            return true;
        }
    }

    #clientLogin(response) {
        // check if response is success or not
        if (response.success) {
            this.token.setToken(response.data.token);
            this.router.router.push(this.router.redirects.home);
            return response;
        } else {
            return response;
        }
    }

    #clientLogout() {
        // remove token from localStorage
        this.token.removeToken();
        localStorage.removeItem("user");
        this.store.state.user = {
            created_at: "",
            email: "",
            name: "",
            updated_at: ""
        };
        this.router.router.push(this.router.redirects.login);
    }
}