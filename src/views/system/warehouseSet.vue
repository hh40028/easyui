<template>
    <div>
        <Layout bodyCls="f-column" style="height:calc(100vh - 52px);" :border="false">
            <LayoutPanel region="east" style="width:20%;">
                <p class="text-center" v-if="!warehouse.id">选择左面仓库显示货位树</p>
                <Panel :bodyStyle="{padding:'5px'}" :border="false" v-if="warehouse.id>0">
                    <LinkButton iconCls="icon-add" :plain="true" @click="addCargolocation">下级货位</LinkButton>
                    <LinkButton iconCls="icon-edit" :plain="true" @click="editCargolocation">编辑</LinkButton>
                    <LinkButton iconCls="icon-remove" :plain="true" @click="deleteCargolocation">删除</LinkButton>
<!--                    <LinkButton iconCls="icon-reload" :plain="true" @click="reloadCargolocation">刷新</LinkButton>-->
                </Panel>
                <div class="p-10">
                    <Tree :data="cargolocations"
                          @selectionChange="selectCargolocation($event)"></Tree>
                </div>
            </LayoutPanel>
            <LayoutPanel region="north" style="height:50px;">
                <Panel :bodyStyle="{padding:'5px'}" :border="false">
                    <LinkButton iconCls="icon-add" :plain="true" class="m-r-5" @click="add">新建</LinkButton>
                    <LinkButton iconCls="icon-edit" :disabled="!warehouse.id" :plain="true" @click="edit">编辑</LinkButton>
                </Panel>
            </LayoutPanel>
            <LayoutPanel region="center" style="height:100%;border-right: 1px solid #ddd">
                <DataGrid :data="warehouses"
                          class="f-full"
                          :border="false"
                          selectionMode="single"
                          @selectionChange="selectObj($event)">
                    <GridColumn field="status" :width="50" align="center">
                        <template slot="header" slot-scope="scope">
                            启用
                        </template>
                        <template slot="body" slot-scope="scope">
                            <input type="checkbox" v-model="scope.row.status"
                                   @change="onCheckedChange(scope.row)">
                        </template>
                    </GridColumn>
                    <GridColumn field="name" width="100" title="仓库名称" align="center"></GridColumn>
                    <GridColumn field="address" width="100" title="仓库地址" align="center"></GridColumn>
                    <GridColumn field="managername" width="100" title="仓库负责人" align="center"></GridColumn>
                    <GridColumn field="checking" width="100" title="盘点" align="center"></GridColumn>
                </DataGrid>
            </LayoutPanel>
        </Layout>
        <Dialog ref="editWarehouseDlg" closed
                :title="'编辑仓库'"
                :dialogStyle="{width:'400px',height:'320px'}"
                bodyCls="f-column"
                :modal="true">
            <div class="f-full">
                <div class="col-12 p-10">
                    <label>仓库名称</label>
                    <input type="text" v-model="warehouse.name" class="form-control">
                </div>
                <div class="col-12 p-10">
                    <label>仓库地址</label>
                    <input type="text" v-model="warehouse.address" class="form-control">
                </div>
                <div class="col-12 p-10">
                    <label>仓库负责人</label>
                    <input type="text" v-model="warehouse.managername" readonly @click="openUserDlg" class="form-control">
                </div>
            </div>
            <div class="dialog-button">
                <LinkButton style="width:80px" @click="save">保存</LinkButton>
            </div>
        </Dialog>
        <selectUser ref="selectUser" @selectUser="selectUser"></selectUser>

        <Dialog ref="editCargolocationDlg" closed
                :title="'编辑货位'"
                :dialogStyle="{width:'300px',height:'180px'}"
                bodyCls="f-column"
                :modal="true">
            <div class="f-full">
                <div class="col-12 p-15">
                    <label>货位编码</label>
                    <input type="text" v-model="selectCargolocationObj.number" class="form-control">
                </div>
            </div>
            <div class="dialog-button">
                <LinkButton style="width:80px" @click="saveCargolocation">保存</LinkButton>
            </div>
        </Dialog>
    </div>
</template>

<script>
import selectUser from '@/components/selectUser.vue';

export default {
    name: "app",
    data() {
        return {
            warehouse: {},
            warehouses: [],
            users: [],
            cargolocations: [],
            selectCargolocationObj: {},
            cargolocation: {}
        }
    },
    created: function () {
        this.loadUsers();
        this.load();
    },
    components: {
        selectUser
    },
    methods: {
        loadUsers() {
            let vm = this;
            this.$root.getData("api/getUserList", {}, function (data) {
                vm.users = data;
            })
        },
        load: function () {
            let vm = this;
            this.$root.getData("warehouse/getList", {}, function (data) {
                vm.warehouses = [];
                data.forEach(function (e) {
                    if (e.checking) {
                        e.checking = "盘点中...";
                    }
                    vm.warehouses.push(e);
                })
            })
        },
        add() {
            this.warehouse = {};
            this.$refs.editWarehouseDlg.open();
        },
        openUserDlg() {
            this.$refs.selectUser.open();
        },
        selectObj(obj) {
            this.warehouse = this.clone(obj);
            let vm = this;
            this.getData("cargolocation/getTreeNotWarehouse", {warehouseId: this.warehouse.id}, function (data) {
                console.log(data);
                vm.cargolocations =[{id:vm.warehouse.id,text:vm.warehouse.name,children:data,isWarehouse:true}];
            })
        },
        reloadCargolocation(){
            this.selectObj( this.warehouse);
        },
        selectUser(obj) {
            this.$set(this.warehouse, 'managername', obj.username);
            this.$set(this.warehouse, 'manager', obj.id);
        },
        save() {
            let vm = this;
            this.getData("warehouse/save", this.warehouse, function (data) {
                vm.$refs.editWarehouseDlg.close();
                vm.load();
            })
        },
        edit() {
            this.$refs.editWarehouseDlg.open();
        },
        onCheckedChange(obj) {
            let vm = this;
            this.getData("warehouse/save", obj, function (data) {
                vm.load();
            })
        },
        selectCargolocation(obj){
            this.selectCargolocationObj=obj;
        },
        editCargolocation(){
            if(this.selectCargolocationObj.id>0){
                this.cargolocation={
                    pid:this.selectCargolocationObj.id
                }
                this.$refs.editCargolocationDlg.open();
            }else{
                this.alert('请选择一个树节点');
            }
        },
        addCargolocation(){
            if(this.selectCargolocationObj.id>0){
                this.cargolocation={
                    pid:this.selectCargolocationObj.id
                }
                this.$refs.editCargolocationDlg.open();
            }else{
                this.alert('请选择一个树节点');
            }
        },
        saveCargolocation(){
            let vm = this;
            this.getData("cargolocation/updateNumber", {id:this.selectCargolocationObj.id,number:this.selectCargolocationObj.number}, function (data) {
                vm.$refs.editCargolocationDlg.close();
                vm.selectObj(vm.warehouse);
            })
        },
        deleteCargolocation(){
            let vm = this;
            if(!this.selectCargolocationObj.isWarehouse){
                this.confirm('确认吗?', function () {
                    vm.getData("cargolocation/delete", {id: vm.selectCargolocationObj.id}, function (data) {
                        vm.selectObj(vm.warehouse);
                    })
                })
            }else{
                this.alert('不能删除仓库');
            }
        },
        checkedNodes(nodes){
            console.log(nodes);
        }
    }
}
</script>

<style scoped>

</style>
