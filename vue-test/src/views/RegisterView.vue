<template>
    <div class="register">
        <h1>Register</h1>
        <form @submit.prevent="register">
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" class="form-control" id="name" v-model="name">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" v-model="email">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" v-model="password">
            </div>
            <div class="form-group">
                <label for="cpassword">Confirm Password</label>
                <input type="password" class="form-control" id="cpassword" v-model="cpassword">
            </div>
            <button type="submit" class="btn btn-primary">Register</button>
        </form>
    </div>
</template>

<script>
import auth from '../auth'

export default {
    name: 'RegisterView',
    data() {
        return {
            name: '',
            email: '',
            password: '',
            cpassword: ''
        }
    },
    methods: {
        async register() {
            await auth.register({
                name: this.name,
                email: this.email,
                password: this.password,
                password_confirmation: this.cpassword
            });
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