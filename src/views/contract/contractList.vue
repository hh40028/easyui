<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'8px'}" :border="false">
                <LinkButton iconCls="icon-add" :plain="true" @click="add">新建</LinkButton>
                <LinkButton iconCls="icon-ok" class="m-r-5" :disabled="!obj.id" :plain="true" @click="view">查看</LinkButton>
                <input class="m-t-5" type="checkbox" v-model="isRedback"
                       @change="loadPage(pageNumber, pageSize)" id="ck">
                <label for="ck" :class="{'c-red':isRedback}">显示删除合同</label>
                <div class="pull-right">
                    <filterList @filterLoad="filterLoad"></filterList>
                </div>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column" :border="false">
            <DataGrid
                :border="false"
                class="f-full"
                :columnResizing="true"
                :data="data"
                :total="total"
                selectionMode="single"
                :rowCss="getRowCss"
                :loading="loading"
                @selectionChange="selectObj($event)"
                @rowDblClick="view"
                :pageNumber="pageNumber"
                :pageSize="pageSize"
                @pageChange="onPageChange($event)"
                :pagination="true"
                :pagePosition="'bottom'">
                <GridColumn title="序号" width="40" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.rowIndex + 1 }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="contractno" title="合同单号" width="120" align="center"></GridColumn>
                <GridColumn field="contractname" title="合同名称" width="180" align="center"></GridColumn>
                <GridColumn field="status" title="合同状态" width="120" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            <span v-if="scope.row.status===2">销售订单</span>
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="typename" title="合同类型" width="180" align="center"></GridColumn>
                <GridColumn field="signdate" title="签订日期" width="120" align="center"></GridColumn>
                <GridColumn field="depname" title="部门名称" width="120" align="center"></GridColumn>
                <GridColumn field="username" title="业务员" width="120" align="center"></GridColumn>
                <GridColumn field="customername" title="客户名称" width="180" align="center"></GridColumn>
                <GridColumn field="customeruser" title="客户代表" width="120" align="center"></GridColumn>
                <GridColumn field="signdate" title="签订日期" width="120" align="center"></GridColumn>
                <GridColumn field="effectivedate" title="生效日期" width="120" align="center"></GridColumn>
                <GridColumn field="startdate" title="开始日期" width="120" align="center"></GridColumn>
                <GridColumn field="enddate" title="结束日期" width="120" align="center"></GridColumn>
                <GridColumn field="amount" title="合同金额" width="120" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ toMoney(scope.row.amount, '￥') }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="remark" title="备注" width="280" align="left"></GridColumn>
            </DataGrid>
            <Dialog ref="editContractDlg" closed
                    :title="'编辑合同'"
                    :dialogStyle="{width:'80vW',height:'80vH'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <Layout bodyCls="f-column">
                        <LayoutPanel region="north" style="height:280px;">
                            <div class="col-3 p-t-10 p-l-10 p-r-10">
                                <label>合同单号</label>
                                <input type="text" v-model="obj.contractno" class="form-control">
                            </div>
                            <div class="col-3 p-t-10 p-l-10 p-r-10">
                                <label>合同名称</label>
                                <input type="text" class="form-control" v-model="obj.contractname">
                            </div>
                            <div class="col-3 p-t-10 p-l-10 p-r-10">
                                <label>合同类型</label>
                                <selectDict :type="'hetongleixing'" input="true" :dictname="obj.contracttype" @selectDict="selectDict"></selectDict>
                            </div>
                            <div class="col-3 p-t-10 p-l-10 p-r-10">
                                <label>业务部门</label>
                                <selectOrganization input="true" :name="obj.depname" @selectOrganization="selectOrganization"></selectOrganization>
                            </div>
                            <div class="col-3 p-t-10 p-l-10 p-r-10">
                                <label>业务员</label>
                                <selectUser input="true" :username="obj.username" @selectUser="selectUser"></selectUser>
                            </div>
                            <div class="col-3 p-t-10 p-l-10 p-r-10">
                                <label>客户名称</label>
                                <selectCustomer input="true" :customername="obj.customername" @selectCustomer="selectCustomer"></selectCustomer>
                            </div>
                            <div class="col-3 p-t-10 p-l-10 p-r-10">
                                <label>客户代表</label>
                                <input type="text" class="form-control" v-model="obj.customeruser">
                            </div>
                            <div class="col-3 p-t-10 p-l-10 p-r-10">
                                <label>签订日期</label>
                                <input type="date" class="form-control" v-model="obj.signdate">
                            </div>
                            <div class="col-3 p-t-10 p-l-10 p-r-10">
                                <label>生效日期</label>
                                <input type="date" class="form-control" v-model="obj.effectivedate">
                            </div>
                            <div class="col-3 p-t-10 p-l-10 p-r-10">
                                <label>开始日期</label>
                                <input type="date" class="form-control" v-model="obj.startdate">
                            </div>
                            <div class="col-3 p-t-10 p-l-10 p-r-10">
                                <label>结束日期</label>
                                <input type="date" class="form-control" v-model="obj.enddate">
                            </div>
                            <div class="col-12 p-10">
                                <label>备注说明</label>
                                <input type="text" v-model="obj.remark" class="form-control">
                            </div>
                        </LayoutPanel>
                        <LayoutPanel region="center" style="height:100%">
                            <DataGrid :columnResizing="true"
                                      :bodyStyle="{padding:'5px',border:0}"
                                      class="f-full"
                                      :border="false"
                                      :data="obj.children"
                                      idField="id">

                                <GridColumn title="序号" width="50" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <div>{{ scope.rowIndex + 1 }}</div>
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="number" title="商品编号" align="center"></GridColumn>
                                <GridColumn field="name" title="商品名称" align="center"></GridColumn>
                                <GridColumn field="norm" title="商品规格" align="center"></GridColumn>
                                <GridColumn field="model" title="商品型号" align="center"></GridColumn>
                                <GridColumn field="unit" title="商品单位" align="center"></GridColumn>
                                <GridColumn field="count" title="合同数量" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <input type="number" class="w-100 text-center" v-model="scope.row.count">
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="price" title="合同单价" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <input type="number" class="w-100 text-center" v-model="scope.row.price">
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="amount" title="金额" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                        <span v-if="!isNaN(scope.row.count) && !isNaN(scope.row.price)">
                                        {{ toMoney(scope.row.count * scope.row.price) }}
                                        </span>
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn title="移除" align="center" width="50">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <a class="c-red" @click="removeItem(scope.rowIndex,scope.row)">删除</a>
                                        </div>
                                    </template>
                                </GridColumn>
                            </DataGrid>
                        </LayoutPanel>
                    </Layout>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="$refs.selectProductCom.open()">选择商品</LinkButton>
                    <LinkButton style="width:80px" @click="save">保存合同</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editContractDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
            <Dialog ref="openContractDlg" closed
                    :title="'合同信息'"
                    :dialogStyle="{width:'80vW',height:'80vH'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <contractView ref="contractview" :id="obj.id"></contractView>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton v-if="obj.status===0" @click="edit">编辑</LinkButton>
                    <LinkButton v-if="obj.status===0" @click="transformPurchaseOrder">生成销售订单</LinkButton>
                    <!--                <LinkButton style="width:80px" v-if="obj.status===0" @click="startProcess">生成销售订单</LinkButton>-->
                    <LinkButton @click="deleteObj">删除</LinkButton>
                    <LinkButton @click="$refs.openContractDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
            <selectSPRUser ref="selectSPRUser" @selectUser="send"></selectSPRUser>
            <selectProduct ref="selectProductCom" @selectProduct="selectCommodity"></selectProduct>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectProduct from '@/components/selectProduct.vue';
import selectDict from '@/components/selectDict.vue';
import selectOrganization from '@/components/selectOrganization.vue';
import selectCustomer from '@/components/selectCustomer.vue';
import selectUser from '@/components/selectUser.vue';
import selectSPRUser from '@/components/selectUser.vue';
import contractView from '@/components/contractView.vue';
import filterList from '@/components/filterList.vue'

export default {
    name: "app",
    data() {
        return {
            total: 0,
            pageSize: 15,
            pageNumber: 1,
            data: [],
            loading: false,
            obj: {
                children: []
            },
            warehouses: [],
            isRedback: false,
            filterString: '',
            timeout: null
        }
    },
    created: function () {
        this.loadWarehouses();
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        selectProduct, selectUser, selectDict, selectOrganization,
        selectCustomer, contractView, selectSPRUser, filterList
    },
    methods: {
        loadWarehouses: function () {
            let vm = this;
            this.getData("warehouse/getList", {}, function (data) {
                vm.warehouses = data;
            })
        },
        onPageChange(event) {
            this.pageNumber = event.pageNumber;
            this.pageSize = event.pageSize;
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.loading = true;
            let vm = this;
            let url = 'contract/getQueryList';
            if (this.isRedback) {
                url = 'contract/getQueryListByRedback';
            }
            this.$root.getData(url, {
                tablename: "contractview",
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString
            }, function (data) {
                vm.total = data.total;
                vm.data = [];
                data.children.forEach(function (e) {
                    if (!isNaN(e.amount)) {
                        e.amount = e.amount.toFixed(2);
                    }
                    if (e.submit && e.enterwarehouse) {
                        e.inbound = "完成";
                    }
                    if (e.submit && !e.enterwarehouse) {
                        e.inbound = "提交";
                    }
                    vm.data.push(e);
                })
                vm.loading = false;
            })
        },
        selectObj(obj) {
            this.obj = this.clone(obj);
        },
        add() {
            this.obj = {
                children: []
            };
            this.$refs.editContractDlg.open();
        },
        selectDict(dict) {
            this.$set(this.obj, 'contracttype', dict.id);
            this.$set(this.obj, 'hetongleixing', dict.name);
        },
        selectOrganization(org) {
            this.$set(this.obj, 'depname', org.text);
            this.$set(this.obj, 'depid', org.id);
        },
        selectUser(obj) {
            this.$set(this.obj, 'userid', obj.id);
            this.$set(this.obj, 'username', obj.username);
        },
        selectSupplier(obj) {
            this.$set(this.obj, 'supplierid', obj.id);
            this.$set(this.obj, 'suppliername', obj.name);
        },
        selectCustomer(obj) {
            this.$set(this.obj, 'customername', obj.name);
            this.$set(this.obj, 'customerid', obj.id);
        },
        selectCommodity(obj) {
            obj.productid = obj.id;
            obj.id = null;
            obj.bigunit = obj.bigpackage;
            obj.bigpackage = false;
            this.obj.children.push(obj);
        },
        openSelectCommodityDlg() {
            this.$refs.selectProductDlg.open();
        },
        save() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("contract/save", {
                    obj: JSON.stringify(vm.obj),
                    rows: JSON.stringify(vm.obj.children)
                }, function (data) {
                    vm.$refs.editContractDlg.close();
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        },
        submit() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("purchase/submit", {id: vm.obj.id}, function (data) {
                    vm.$refs.purchaseViewDlg.close();
                    vm.$refs.editPurchaseDlg.close();
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        },
        removeItem(index, obj) {
            if (obj.id > 0) {
                let vm = this;
                this.confirm('确认吗?', function () {
                    vm.getData("contractdetail/delete", {id: obj.id}, function (data) {
                        vm.obj.children.splice(index, 1);
                    })
                })
            } else {
                this.obj.children.splice(index, 1);
            }
        },
        printPDF() {
            let vm = this;
            this.getData("purchase/buildPDF", {id: this.obj.id}, function (data) {
                vm.reportPdfUrl = vm.$root.basePath + 'common/getReportPdf?r=' + Math.random() + '&filename=' + data;
                window.open(vm.reportPdfUrl);
            })
        },
        getRowCss(row) {
            if (this.isRedback) {
                return {background: "#f2dede"};
            }
            return null;
        },
        view() {
            this.$refs.openContractDlg.open();
        },
        edit() {
            let vm = this;
            this.getData("contract/getMap", {id: this.obj.id}, function (data) {
                vm.obj = data;
                vm.$refs.openContractDlg.close();
                vm.$refs.editContractDlg.open();
            })
        },
        startProcess() {
            this.$refs.selectSPRUser.openDlg();
        },
        send(obj) {
            let vm = this;
            this.confirm('发送' + obj.username + ',确认吗?', function () {
                vm.getData("contract/startProcess", {id: vm.obj.id, sprid: obj.id}, function (data) {
                    vm.$refs.openContractDlg.close();
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        },
        deleteObj() {
            let vm = this;
            this.confirm('确认删除吗?', function () {
                vm.getData("contract/redback", {id: vm.obj.id}, function (data) {
                    vm.$refs.openContractDlg.close();
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        },
        transformPurchaseOrder() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("contract/transformPurchaseOrder", {id: vm.obj.id}, function (data) {
                    vm.$refs.openContractDlg.close();
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        },
        filterLoad(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        }
    }
}
</script>

<style scoped>

</style>
