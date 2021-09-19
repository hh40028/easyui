<template>
    <Layout style="height: calc(100vh - 52px)" bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'5px'}" :border="false">
                <div class="pull-right">
                    <LinkButton :plain="true" @click="$router.push('ganttView')">生产甘特图</LinkButton>
                </div>
                <LinkButton iconCls="icon-add" :plain="true" @click="add">添加计划</LinkButton>
                <LinkButton iconCls="icon-edit" :disabled="!obj.id" :plain="true" @click="edit">编辑</LinkButton>
                <LinkButton iconCls="icon-ok" :disabled="!obj.id || obj.status>0" :plain="true" @click="release">下达加工单</LinkButton>
                <LinkButton iconCls="icon-ok" :disabled="!obj.id || obj.purchaserelease" :plain="true" @click="releasePurchaseplan">下达采购计划</LinkButton>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" :border="false" bodyCls="f-column">
            <TreeGrid :data="data" :border="false"
                      idField="id" treeField="commoditynumber"
                      @selectionChange="selectCurrRow($event)"
                      :columnResizing="true"
                      class="f-full">
                <GridColumn field="commoditynumber" title="产品编号" align="left" width="120"></GridColumn>
                <GridColumn field="commodityname" title="产品名称" align="center" width="120"></GridColumn>
                <GridColumn field="number" title="计划单号" align="center" width="240"></GridColumn>
                <GridColumn field="norm" title="产品规格" align="center" width="120"></GridColumn>
                <GridColumn field="model" title="产品型号" align="center" width="120"></GridColumn>
                <GridColumn field="sourcename" title="来源" align="center" width="120"></GridColumn>
                <GridColumn field="starttime" title="开始日期" align="center" width="120"></GridColumn>
                <GridColumn field="finishtime" title="计划完成日期" align="center" width="120"></GridColumn>
                <GridColumn field="deptname" title="生产车间" align="center" width="120"></GridColumn>
                <GridColumn field="workername" title="生产人" align="center" width="120"></GridColumn>
                <GridColumn field="status" title="加工状态" align="center" width="120">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            <span class="c-orange" v-if="scope.row.status===0">新建</span>
                            <span class="c-blue" v-if="scope.row.status===1">已下达</span>
                            <span class="c-teal" v-if="scope.row.status===2">已完工</span>
                        </div>
                    </template>
                </GridColumn>
                 <GridColumn field="purchaserelease" title="采购计划" align="center" width="120">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            <span class="c-orange" v-if="!scope.row.purchaserelease">未下达</span>
                            <span class="c-teal" v-if="scope.row.purchaserelease">已下达</span>
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="plancount" title="计划数量" align="center" width="120"></GridColumn>
                <GridColumn field="finishcount" title="当前完成数量" align="center" width="120"></GridColumn>
                <GridColumn field="unitcost" title="完成比例" align="center" width="120">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ (scope.row.finishcount / scope.row.plancount) * 100 }}%
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="unitcost" title="剩余数量" align="center" width="120">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.row.plancount - scope.row.finishcount }}
                        </div>
                    </template>
                </GridColumn>
            </TreeGrid>
            <selectSaleorder ref="selectSaleorderCom" @getSaleorder="getSaleorder"></selectSaleorder>

            <Dialog ref="editPlantimeDlg" closed
                    :title="'编辑'"
                    :dialogStyle="{width:'300px'}"
                    :draggable="true"
                    :resizable="true"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <div class="col p-10">
                        <label>开始日期</label>
                        <input type="date" v-model="obj.starttime" class="form-control">
                    </div>
                    <div class="col p-10">
                        <label>截止日期</label>
                        <input type="date" v-model="obj.finishtime" class="form-control">
                    </div>
                    <div class="col-12 p-10" v-if="obj.source===789">
                        <label>委外单位</label>
                        <selectSupplier :input="true" :suppliername="obj.deptname" @selectSupplier="selectSupplier"></selectSupplier>
                    </div>
                    <div class="col-12 p-10" v-if="obj.source===787">
                        <label>生产车间</label>
                        <selectOrganization :input="true" :name="obj.deptname" @selectOrganization="selectOrganization"></selectOrganization>
                    </div>
                    <div class="col-12 p-10" v-if="obj.source===787">
                        <label>生产人</label>
                        <selectUser :username="obj.workername" :input="true" @selectUser="selectUser" :organizationid="obj.deptid"></selectUser>
                    </div>
                </div>
                <div class="dialog-button">
                    <LinkButton style="width:80px" @click="saveItem">保存</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editPlantimeDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectSaleorder from '@/components/selectSaleorder.vue';
import selectOrganization from '@/components/selectOrganization.vue';
import selectUser from '@/components/selectUser.vue';
import selectSupplier from '@/components/selectSupplier.vue';

export default {
    name: "app",
    data() {
        return {
            obj: {},
            data: []
        }
    },
    created: function () {
        this.load();
    },
    components: {
        selectSaleorder, selectOrganization, selectUser, selectSupplier
    },
    methods: {
        load: function () {
            let vm = this;
            this.getData("productionplan/getTree", {}, function (data) {
                vm.data = data;
            })
        },
        add() {
            this.$refs.selectSaleorderCom.open();
        },
        getSaleorder(obj) {
            let vm = this;
            this.confirm('导入到生产计划，确认吗?', function () {
                vm.getData("saleorder/changeProductplan", {id: obj.id}, function (data) {
                    vm.load();
                })
            })
        },
        selectCurrRow(obj) {
            this.obj = {
                id: obj.id,
                starttime: obj.starttime,
                finishtime: obj.finishtime,
                deptid: obj.deptid,
                deptname: obj.deptname,
                worker: obj.worker,
                workername: obj.workername,
                status: obj.status,
                sourcename:obj.sourcename,
                source:obj.source,
                purchaserelease:obj.purchaserelease
            };
            console.log(this.obj);
        },
        edit() {
            this.$refs.editPlantimeDlg.open();
        },
        saveItem() {
            let vm = this;
            this.getData("productionplan/saveEdit", {
                id: this.obj.id,
                starttime: this.obj.starttime,
                finishtime: this.obj.finishtime,
                deptid: vm.obj.deptid,
                worker: vm.obj.worker,
                external:vm.obj.source === 789
            }, function (data) {
                vm.$refs.editPlantimeDlg.close();
                vm.load();
            })
        },
        selectSupplier(obj){
            this.$set(this.obj, 'deptid', obj.id);
            this.$set(this.obj, 'deptname', obj.name);
        },
        selectOrganization(obj) {
            this.$set(this.obj, 'deptid', obj.id);
            this.$set(this.obj, 'deptname', obj.name);
        },
        selectUser(obj) {
            this.$set(this.obj, 'worker', obj.id);
            this.$set(this.obj, 'workername', obj.username);
        },
        release() {
            let vm = this;
            this.confirm('下达加工单，确认吗?', function () {
                vm.getData("productionplan/release", {
                    id: vm.obj.id
                }, function (data) {
                    vm.load();
                })
            })
        },
        releasePurchaseplan() {
            let vm = this;
            this.confirm('下达采购计划，确认吗?', function () {
                vm.getData("productionplan/purchaseplanRelease", {
                    id: vm.obj.id
                }, function (data) {
                    vm.load();
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
