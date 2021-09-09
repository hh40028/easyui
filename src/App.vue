<template>
    <div>
        <Layout style="width:100vw;height:100vh" :border="false" bodyCls="f-column">
            <LayoutPanel region="north" style="height:50px;" :border="false" :bodyStyle="{backgroundColor: 'rgba(0,0,0,0.02)'}">
                <div class="text-left col-4">
                    <div style="font-size: 20px;font-weight: 700;padding:10px">P3ERP</div>
                </div>
                <div class="title col-4 f-16">{{ $root.menu.text }}<span v-show="$root.twomenu.id>0">－</span>{{ $root.twomenu.text }}</div>
                <div class="col-4">
                    <div style="float: right" class="text-right" v-if="$root.userObj">
                        <div style="float: right;" class="m-r-10 title c-orange" v-if="$root.userObj" @click="logout">注销</div>
                        <div style="float: right;" class="m-r-20 title">用户({{ $root.userObj.username }})</div>
                        <div style="float: right;" class="m-r-20 title">
                            <div class="c-black" @click="$router.push('index')" :class="{'c-red':$root.taskcount>0}">
                                待办
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutPanel>
            <LayoutPanel region="west" style="width:70px;height: calc(100vh - 80);overflow-y: auto;"
                         :border="false" :bodyStyle="{backgroundColor: 'rgba(0,0,0,0.02)'}">
                <div v-for="menu in menus" :key="menu.id" @click="showNav(menu)" class="text-center"
                     :class="{'select-menu':$root.menu.id===menu.id}">
                    <img :src="menu.icon" style="margin: 5px 5px 0 5px;width:35px">
                    <div style="text-align: center;margin-bottom: 10px;padding-bottom: 10px;font-size: 14px">{{ menu.text }}</div>
                </div>
            </LayoutPanel>
            <LayoutPanel region="center" style="height: 100%" :border="true">
                <router-view/>
            </LayoutPanel>
        </Layout>
        <login></login>
    </div>
</template>

<script>
import login from './components/login.vue';

export default {
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.screenHeight = window.innerHeight
            })()
        }
    },
    data() {
        return {
            menus: [],
            screenHeight: window.innerHeight,
            loginname: '',
            password: ''
        }
    },
    components: {
        login
    },
    created() {
        this.loadMenu();
        this.$root.loadTaskCount();
        setInterval(this.$root.loadTaskCount, 30000);
    },
    methods: {
        loadMenu: function () {
            let vm = this;
            this.getData("menu/getTree", {pid: 0}, function (data) {
                vm.menus = [];
                data.forEach(function (e) {
                    let icon = '';
                    if (e.icon) {
                        icon = require('./assets/images/' + e.icon);
                    }
                    vm.$set(e, 'icon', icon);
                    vm.menus.push(e);
                })
            })
        },
        showNav(menu) {
            this.$root.menu = menu;
            sessionStorage.menu = JSON.stringify(menu);
            if (menu.url) {
                this.$root.twomenu = {};
                this.$router.push(menu.url);
            } else {
                this.$root.twomenu = {text: '导航', id: 2};
                this.$router.push('emptyToNav');
            }
        },
        logout() {
            let vm = this;
            this.confirm('确认吗?', function () {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('userObj');
                vm.$root.userObj = undefined;
                vm.bus.$emit('login', true);
            })
        }
    }
};
</script>
<style>
.title {
    text-align: center;
    font-size: 16px;
    line-height: 50px;
}

.cake {
    color: red;
    animation: move 3s 0s infinite;
    -webkit-animation: move 3s 0s infinite;
    transform-origin: bottom;
    -webkit-transform-origin: bottom;
}

.select-menu {
    background-color: rgba(0, 0, 0, 0.1);
}
</style>
