<template>
    <Layout bodyCls="f-column" style="height:calc(100vh - 50px)">
        <LayoutPanel region="west" style="width:320px;">
            <Panel title="角色列表" :bodyStyle="{padding:'10px'}" class="f-full" :border="false">
                <Tree :data="roles" @selectionChange="selection($event)"></Tree>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%">
            <Panel :bodyStyle="{padding:'5px'}" v-show="selectRole.id>0">
                <LinkButton iconCls="icon-add" :plain="true" @click="add">新增</LinkButton>
                <LinkButton iconCls="icon-remove" :disabled="!obj.id" :plain="true" @click="removeObj">删除</LinkButton>
            </Panel>
            <DataGrid class="f-full" :data="userroles" style="height:calc(100vh - 100px)"  v-show="selectRole.id>0"
                      selectionMode="single" :border="false"
                      @selectionChange="selectObj($event)">
                <GridColumn field="username" title="用户姓名" width="100"></GridColumn>
                <GridColumn field="loginname" title="登录名"></GridColumn>
            </DataGrid>
            <selectUser ref="selectUserCom" username="" @selectUser="selectUser"></selectUser>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectUser from '@/components/selectUser.vue';
export default {
    name: "app",
    data() {
        return {
            roles: [],
            userroles:[],
            selectRole:{},
            obj:{}
        }
    },
    created: function () {
        this.loadRoles();
    },
    components: {
        selectUser
    },
    methods: {
        loadRoles: function () {
            let vm = this;
            this.getData("sys/getRoleList", {}, function (data) {
                vm.roles = [];
                data.forEach(function (e) {
                    vm.roles.push({id: e.id, text: e.name});
                })
            })
        },
        selection(role){
            let vm = this;
            this.selectRole=role;
            this.getData("userrole/getViewList", {roleid:role.id}, function (data) {
                vm.userroles=data;
            })
        },
        selectUser(obj){
            let vm = this;
            this.getData("userrole/save", {roleid:this.selectRole.id,userid:obj.id}, function (data) {
                vm.selection(vm.selectRole);
            })
        },
        add(){
            this.$refs.selectUserCom.open();
        },
        selectObj(obj){
            this.obj=obj;
        },
        removeObj(){
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("userrole/delete", {id:vm.obj.id}, function (data) {
                    vm.selection(vm.selectRole);
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
