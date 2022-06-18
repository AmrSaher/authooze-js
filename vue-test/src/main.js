import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import auth from './auth'
import Authooze from 'authooze'

auth.setConfig({
    APP_SECRET_KEY: '4d195dd4da60e4a8fd170a46888a640a879b0ee0',
    APP_NAME: 'vue test app',
    router: new Authooze.Router(router, {
        home: '/',
        login: '/login',
        register: '/register'
    }),
    store: new Authooze.Store(store)
});

createApp(App).use(store).use(router).mount('#app')
