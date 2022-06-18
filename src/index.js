const axios = require("axios");

class App {
    constructor () {
        // set axios base url and auth links if configured and connected to backend
        this.READY_BACKEND = "http://127.0.0.1:8000/api";
    }

    setConfig(options) {
        this.configratoins = options || {};
        if (!this.#testConfigrations()) return;
        this.#chooseHandler();
        return this;
    }

    #testConfigrations() {
        // Error if not configured or not connected to backend
        try {
            let configrations = this.configratoins.api ? 
            [this.configratoins.api.url, this.configratoins.api.links] : 
            [this.configratoins.APP_SECRET_KEY, this.configratoins.APP_NAME];
        } catch (e) {
            console.error("Please, complete the configrations.");
            return false;
        }
        return true;
    }

    #chooseHandler() {
        // set axios base url and auth links if configured and connected to backend
        axios.defaults.baseURL = this.configratoins.api ? this.configratoins.api.url : this.READY_BACKEND;
        this.authLinks = this.configratoins.api ? this.configratoins.api.links : {
            register: 'register',
            login: 'login',
            logout: 'logout',
            deleteAccount: 'user/delete',
            user: 'user'
        };
    }

    setRouter(router) {
        this.router = router || {};
        if (!this.#testRouter()) return;
        this.#createMiddlewares();
        return this;
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

    #testRouter() {
        // Error if not configured or not connected to router
        try {
            let router = [this.router.router, this.router.redirects];
        } catch (e) {
            console.error("Please, set router requirements.");
            return false;
        }
        return true;
    }

    setStore(store) {
        this.store = store || {};
        if (!this.#testStore()) return;
        this.store.state.user = {
            created_at: "",
            email: "",
            name: "",
            updated_at: ""
        };
        return this;
    }

    #testStore() {
        // Error if not configured or not connected to store
        try {
            let state = this.store.state;
        } catch (e) {
            console.error("Please, set store requirements.");
            return false;
        }
        return true;
    }

    mainTest() {
        // Error if not configured or not connected to backend or not connected to router
        try {
            this.#testConfigrations();
            this.#testRouter();
            this.#testStore();
        } catch (e) {
            console.error("Check configrations, router or store.");
            return false;
        }
        return true;
    }

    #setToken(token) {
        return localStorage.setItem("token", token.split("|")[1]);
    }

    #getToken() {
        return localStorage.getItem("token");
    }

    #removeToken() {
        return localStorage.removeItem("token");
    }

    async register(data) {
        if (!this.mainTest()) return;
        let response = await this.#handleResponse("post", this.authLinks.register, this.configratoins.APP_SECRET_KEY ? {...data, secret_key: this.configratoins.APP_SECRET_KEY} : data);
        this.getUser();
        return this.#clientLogin(response);
    }

    async login(data) {
        if (!this.mainTest()) return;
        let response = await this.#handleResponse("post", this.authLinks.login, this.configratoins.APP_SECRET_KEY ? {...data, secret_key: this.configratoins.APP_SECRET_KEY} : data);
        this.getUser();
        return this.#clientLogin(response);
    }

    async logout() {
        if (!this.mainTest()) return;
        let response = await this.#handleResponse("post", this.authLinks.logout, {}, {
            Authorization: `Bearer ${this.#getToken()}`
        })
        if (response.success) {
            this.#removeToken();
            this.store.state.user = {
                created_at: "",
                email: "",
                name: "",
                updated_at: ""
            };
            this.router.router.push(this.router.redirects.login);
        }
    }

    checkAuthed() {
        if (!this.mainTest()) return;
        return this.#getToken() ? (this.getUser() !== null ? true : false) : false;
    }

    async deleteAccount() {
        if (!this.mainTest()) return;
        let response = await this.#handleResponse("delete", this.authLinks.deleteAccount, {}, {
            Authorization: `Bearer ${this.#getToken()}`
        });
        if (response.success) {
            this.#removeToken();
            this.store.state.user = {
                created_at: "",
                email: "",
                name: "",
                updated_at: ""
            };
            this.router.router.push(this.router.redirects.register);
        }
    }

    async getUser() {
        if (!this.mainTest()) return;
        let response = await this.#handleResponse("get", this.authLinks.user, {}, {
            Authorization: `Bearer ${this.#getToken()}`
        });
        if (response.success) {
            this.store.state.user = response.data;
            return true;
        }
        return false;
    }

    async #handleResponse(method, url, data = {}, headers = {}) {
        // post, get or delete request to backend with token if exists
        let result = {};
        await axios({
            method: method,
            url: url,
            data: data,
            headers: headers
        }).then((response) => {
            response.success = true;
            result = response;
        }).catch(error => {
            result = error;
            console.clear();
        });
        return result;
    }

    #clientLogin(response) {
        // check if response is success or not
        if (response.success) {
            this.#setToken(response.data.token);
            this.router.router.push(this.router.redirects.home);
            return response;
        } else {
            return response.response.data.errors;
        }
    }
}

module.exports = {
    App
};