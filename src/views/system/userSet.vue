<template>
    <Layout bodyCls="f-column" style="height:calc(100vh - 50px);" :border="false">
        <LayoutPanel region="west" style="width:280px;">
            <Tree :data="list" @selectionChange="selectOrg($event)"></Tree>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column">
            <Panel :bodyStyle="{padding:'5px'}">
                <LinkButton iconCls="icon-add" :plain="true" @click="add">新增</LinkButton>
                <LinkButton iconCls="icon-edit" :plain="true" @click="edit">编辑</LinkButton>
                <LinkButton iconCls="icon-remove" :plain="true" @click="moveOrg">调离</LinkButton>
            </Panel>
            <DataGrid :columnResizing="true" class="f-full"
                      :bodyStyle="{padding:'5px',border:0}"
                      :border="false"
                      selectionMode="single"
                      :data="userList" @selectionChange="selectUser($event)"
                      idField="id">
                <GridColumn title="序号" align="center" width="50">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.rowIndex + 1 }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn title="启用" align="center" width="50">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            <input type="checkbox" v-model="scope.row.status" @change="changeStatus(scope.row)">
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="username" title="用户姓名" align="center"></GridColumn>
                <GridColumn field="loginname" title="登录名" align="center"></GridColumn>
                <GridColumn field="password" title="密码" align="center"></GridColumn>
            </DataGrid>
            <Dialog ref="editUserDlg" closed
                    :title="'编辑用户信息'"
                    :dialogStyle="{width:'400px',height:'320px'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <div class="col-12 p-10">
                        <label>用户姓名</label>
                        <input type="text" v-model="user.username" class="form-control">
                    </div>
                    <div class="col-12 p-10">
                        <label>登录名</label>
                        <input type="text" v-model="user.loginname" class="form-control">
                    </div>
                    <div class="col-12 p-10">
                        <label>密码</label>
                        <input type="text" v-model="user.password" class="form-control">
                    </div>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="save">保存</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editUserDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
            <selectOrganization ref="selectOrganization" @selectOrganization="selectOrganization"></selectOrganization>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectOrganization from "@/components/selectOrganization";

export default {
    name: "app",
    data() {
        return {
            list: [],
            userList: [],
            user: {},
            organizationid: -1
        }
    },
    created: function () {
        this.load();
    },
    components: {
        selectOrganization
    },
    methods: {
        load() {
            let vm = this;
            this.getData("api/getOrgTree", {}, function (data) {
                vm.list = [];
                data.forEach(function (e) {
                    vm.list.push(e);
                })
                if (vm.list.length > 0) {
                    vm.loadList(vm.list[0].id);
                }
            });
        },
        loadList(orgid) {
            this.organizationid = orgid;
            let vm = this;
            this.$root.getData("api/getListByOrganizationid", {organizationid: orgid}, function (data) {
                vm.userList = data;
            })
        },
        selectOrg(org) {
            this.organizationid = org.id;
            this.loadList(org.id);
        },
        selectUser(obj) {
            this.user = this.clone(obj);
        },
        add() {
            if (this.organizationid < 0) {
                this.alert("请选择一个部门");
            } else {
                this.user = {};
                this.$refs.editUserDlg.open();
            }
        },
        edit() {
            if (!this.user.id) {
                this.alert("请选择一个用户");
            } else {
                this.$refs.editUserDlg.open();
            }
        },
        save() {
            let vm = this;
            this.user.organizationid = this.organizationid;
            this.getData("api/saveUser", this.user, function (data) {
                vm.msg('操作成功');
                vm.$refs.editUserDlg.close();
                vm.loadList(vm.organizationid);
            })
        },
        changeStatus(obj) {
            let vm = this;
            this.getData("api/changeStatus", {id: obj.id, status: obj.status}, function (data) {
                vm.msg('操作成功');
                vm.loadList(vm.organizationid);
            })
        },
        moveOrg(){
            if (!this.user.id) {
                this.alert("请选择一个用户");
            } else {
                this.$refs.selectOrganization.open();
            }
        },
        selectOrganization(org){
            let vm = this;
            this.confirm(this.user.username+'调离至'+org.name+',确认吗?', function () {
                vm.getData("api/moveOrg", {userid:vm.user.id,orgid:org.id}, function (data) {
                    vm.loadList(vm.organizationid);
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
