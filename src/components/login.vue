<template>
    <Dialog ref="loginDlg" closed
            :title="'登录系统'"
            :dialogStyle="{width:'400px',height:'250px'}"
            :modal="true">
        <div class="col-12 p-t-15 p-l-15 p-r-15">
            <label>登录名</label>
            <input type="text" v-model="loginname" class="form-control">
        </div>
        <div class="col-12 p-t-15 p-l-15 p-r-15">
            <label>密码</label>
            <input type="password" v-model="password" class="form-control">
        </div>
        <div class="col-12 p-t-15 p-l-15 p-r-15">
            <LinkButton @click="login">登录</LinkButton>
        </div>
    </Dialog>
</template>

<script>
export default {
    name: "app",
    data() {
        return {
            loginname: '',
            password: ''
        }
    },
    created: function () {
        let vm = this;
        this.bus.$on('login', function(data) {
            vm.$refs.loginDlg.open();
        })
    },
    methods: {
        login() {
            let vm = this;
            this.getData("api/login", {
                loginname: this.loginname, password: this.password
            }, function (data) {
                vm.$refs.loginDlg.close();
                sessionStorage.token = data.token;
                sessionStorage.userObj = JSON.stringify(data.user);
                vm.$root.userObj = data.user;
                vm.$root.menu = {text: '首页'};
                vm.$root.twomenu = {};
                vm.$router.push('empty');
            })
        }
    }
}
</script>

<style scoped>

</style>
