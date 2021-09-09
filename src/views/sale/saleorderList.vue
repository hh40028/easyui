<template>
    <div>
        <Layout bodyCls="f-column" style="height:calc(100vh - 52px);" :border="false">
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
                    @rowDblClick="viewSaleorder"
                    :pageNumber="pageNumber"
                    :pageSize="pageSize"
                    @pageChange="onPageChange($event)"
                    :pagination="true"
                    :pagePosition="'bottom'">
                    <GridColumn title="序号" width="40" align="center" :frozen="true">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                {{ scope.rowIndex + 1 }}
                            </div>
                        </template>
                    </GridColumn>
                    <GridColumn field="number" title="单据号" width="120" align="center" :frozen="true"></GridColumn>
                    <GridColumn field="status" title="出库状态" width="180" align="center">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                <span v-if="scope.row.status===1">已生成</span>
                                <span v-if="scope.row.status===2">已出库</span>
                            </div>
                        </template>
                    </GridColumn>
                    <GridColumn field="customername" title="客户" width="180" align="center"></GridColumn>
                    <GridColumn field="contractno" title="合同编号" width="180" align="center"></GridColumn>
                    <GridColumn field="saleorderdate" title="订货日期" width="120" align="center"></GridColumn>
                    <GridColumn field="total" title="订货金额" width="120" align="right">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                {{ toMoney(scope.row.total, '￥') }}
                            </div>
                        </template>
                    </GridColumn>
                    <GridColumn field="enddate" title="交付日期" width="100" align="center"></GridColumn>
                    <GridColumn field="username" title="录入人" width="100" align="center"></GridColumn>
                    <GridColumn field="remark" title="摘要" width="280" align="left"></GridColumn>
                </DataGrid>
            </LayoutPanel>
        </Layout>
        <Dialog ref="saleorderDlg" closed
                :title="'销售订单明细'"
                :dialogStyle="{width:'80vw',height:'80vh'}"
                bodyCls="f-column"
                :border="false"
                :draggable="true"
                :resizable="true"
                :modal="true">
            <div class="f-full">
                <saleorderView :id="obj.id"></saleorderView>
            </div>
            <div class="dialog-button text-center">
                <LinkButton style="width:80px" @click="buildOutbound">销售出库</LinkButton>
                <LinkButton iconCls="icon-print" style="width:80px">打印</LinkButton>
                <LinkButton iconCls="icon-cancel" style="width:80px" @click="$refs.saleorderDlg.close()">关闭</LinkButton>
            </div>
        </Dialog>
        <selectCommodity ref="selectCommodity" @selectCommodity="selectCommodity"></selectCommodity>
    </div>
</template>

<script>
import selectCommodity from '@/components/selectCommodity.vue';
import selectSupplier from '@/components/selectSupplier.vue';
import saleorderView from '@/components/saleorderView.vue';
import selectUser from '@/components/selectUser.vue';
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
            obj: {},
            list: [],
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
        selectCommodity, selectUser, selectSupplier, saleorderView, filterList
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
            let url = 'saleorder/getQueryList';
            if (this.isRedback) {
                url = 'saleorder/getQueryListByRedback';
            }
            this.$root.getData(url, {
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
            this.obj = {};
            this.list = [];
            this.$refs.editPurchaseDlg.open();
        },
        selectUser(user) {
            this.$set(this.obj, 'managername', user.username);
            this.$set(this.obj, 'manager', user.id);
        },
        selectSupplier(obj) {
            this.$set(this.obj, 'supplierid', obj.id);
            this.$set(this.obj, 'suppliername', obj.name);
        },
        selectCommodity(obj) {
            obj.commodityid = obj.id;
            obj.id = null;
            obj.bigunit = obj.bigpackage;
            obj.bigpackage = false;
            this.list.push(obj);
        },
        openSelectCommodityDlg() {
            this.$refs.selectCommodity.load();
        },
        save() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("saleorder/save", {obj: JSON.stringify(vm.obj), rows: JSON.stringify(vm.list)}, function (data) {
                    vm.$set(vm.obj, 'id', data.id);
                    // vm.$refs.editPurchaseDlg.close();
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        },
        submit() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("saleorder/submit", {id: vm.obj.id}, function (data) {
                    vm.$refs.saleorderViewDlg.close();
                    vm.$refs.editPurchaseDlg.close();
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        },
        loadMap: function (id) {
            let vm = this;
            this.getData("saleorder/getMap", {id: id}, function (data) {
                vm.obj = data.obj;
                vm.list = data.list;
                console.log(vm.list);
            })
        },
        viewSaleorder() {
            if (this.obj.id > 0) {
                this.$refs.saleorderDlg.open();
            }
        },
        editPurchase() {
            this.loadMap(this.obj.id);
            this.$refs.saleorderViewDlg.close();
            this.$refs.editPurchaseDlg.open();
        },
        redback() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("saleorder/redback", {id: vm.obj.id}, function (data) {
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                    vm.$refs.saleorderViewDlg.close();
                    vm.$refs.editPurchaseDlg.close();
                })
            })
        },
        removeItem(index, obj) {
            if (obj.id > 0) {
                let vm = this;
                this.confirm('确认吗?', function () {
                    vm.getData("saleorderchild/delete", {id: obj.id}, function (data) {
                        vm.list.splice(index, 1);
                    })
                })
            } else {
                this.list.splice(index, 1);
            }
        },
        printPDF() {
            let vm = this;
            this.getData("saleorder/buildPDF", {id: this.obj.id}, function (data) {
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
        buildOutbound() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("saleorder/transformOutbound", {id: vm.obj.id}, function (data) {
                    vm.$refs.saleorderDlg.close();
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        },
        filterLoad(fs) {
            this.filterString = fs;
            this.loadPage(this.pageNumber, this.pageSize);
        }
    }
}
</script>

<style scoped>

</style>
