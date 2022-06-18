<template>
    <div class="login">
        <h1>Login</h1>
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" v-model="email">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" v-model="password">
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'LoginView',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        login() {
            console.log('login', this.email, this.password);
        }
    }
}
</script>

<style scoped>
form {
    margin: 0 auto;
    width: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>