import axios from 'axios';

export default class Request {
    constructor() {
    }

    chooseHandler(configratoins, ready_backend) {
        axios.defaults.baseURL = configratoins.api ? configratoins.api.url : ready_backend;
        this.authLinks = configratoins.api ? configratoins.api.links : {
            register: 'register',
            login: 'login',
            logout: 'logout',
            deleteAccount: 'user/delete',
            user: 'user'
        };

        return this.authLinks;
    }

    async sendRequest(method, url, body = {}, headers = {}) {
        let result = {};   
        try {
            result = await axios(url, {
                method: method,
                data: body,
                headers: headers
            });
            result.success = true;
        } catch (e) {
            result = e;
            result.success = false;
            console.error(e);
        }

        return result;
    }
}