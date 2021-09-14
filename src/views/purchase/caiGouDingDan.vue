<template>
    <div>
        <Layout bodyCls="f-column" style="height:calc(100vh - 52px);" :border="false">
            <LayoutPanel region="north" :border="false">
                <Panel :bodyStyle="{padding:'8px'}" :border="false">
                    <LinkButton iconCls="icon-add" :plain="true" @click="add">开单</LinkButton>
                    <LinkButton iconCls="icon-ok" :disabled="!obj.id" :plain="true" @click="viewPurchaseorder">查看</LinkButton>
                    <div class="pull-right">
                        <filterList @filterLoad="filter"></filterList>
                    </div>
                </Panel>
            </LayoutPanel>
            <LayoutPanel region="center" style="height:100%" bodyCls="f-column" :border="false">
                <DataGrid :border="false"
                          class="f-full"
                          :columnResizing="true"
                          :lazy="true"
                          :data="data"
                          :total="total"
                          selectionMode="single"
                          :rowCss="getRowCss"
                          :loading="loading"
                          @selectionChange="selectObj($event)"
                          @rowDblClick="viewPurchaseorder"
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
                    <GridColumn field="number" title="单据号" width="120" align="center"></GridColumn>
                    <GridColumn field="suppliername" title="供应商" width="180" align="center"></GridColumn>
                    <GridColumn field="endtime" title="到货日期" width="120" align="center"></GridColumn>
                    <GridColumn field="amount" title="采购金额" width="100" align="right">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                {{ toMoney(scope.row.amount, '￥') }}
                            </div>
                        </template>
                    </GridColumn>
                    <GridColumn field="username" title="编制人" width="120" align="center"></GridColumn>
                    <GridColumn field="remark" title="摘要" width="280" align="left"></GridColumn>
                </DataGrid>
                <Dialog ref="viewPurchaseorderDlg" closed
                        :title="'采购订单信息'"
                        :dialogStyle="{width:'80vw',height:'80vh'}"
                        :draggable="true"
                        :resizable="true"
                        bodyCls="f-column"
                        :modal="true">
                    <div class="f-full" :border="false">
                        <Layout bodyCls="f-column" :border="false">
                            <LayoutPanel region="north" :border="false">
                                <table border="1" class="w-100">
                                    <tbody>
                                    <tr>
                                        <td class="text-right" style="width: 12.5%">供应商</td>
                                        <td class="text-left" style="width: 12.5%">{{obj.suppliername}}</td>
                                        <td class="text-right" style="width: 12.5%">到货日期</td>
                                        <td class="text-left" style="width: 12.5%">{{obj.endtime}}</td>
                                        <td class="text-right" style="width: 12.5%">合计金额</td>
                                        <td class="text-left" style="width: 12.5%">{{toMoney(obj.amount,'￥')}}</td>
                                        <td class="text-right" style="width: 12.5%">预付订金</td>
                                        <td class="text-left" style="width: 12.5%">{{toMoney(obj.deposit,'￥')}}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-right" style="width: 12.5%">摘要说明</td>
                                        <td class="text-left" colspan="7">{{obj.remark}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </LayoutPanel>
                            <LayoutPanel region="center" style="height:100%" :border="false">
                                <DataGrid
                                    :border="false"
                                    class="f-full"
                                    :columnResizing="true"
                                    :data="list">
                                    <GridColumn field="number" title="商品编号" align="center"></GridColumn>
                                    <GridColumn field="name" title="商品名称" align="center"></GridColumn>
                                    <GridColumn field="norm" title="商品规格" align="center"></GridColumn>
                                    <GridColumn field="model" title="商品型号" align="center"></GridColumn>
                                    <GridColumn field="count" title="采购数量" align="center">
                                        <template slot="body" slot-scope="scope">
                                            <div class="item">
                                                {{ scope.row.count }} {{ ' ' + scope.row.unit }}
                                            </div>
                                        </template>
                                    </GridColumn>
                                    <GridColumn field="price" title="采购单价" align="right">
                                        <template slot="body" slot-scope="scope">
                                            <div class="item">
                                                {{ toMoney(scope.row.price, '￥') }}
                                            </div>
                                        </template>
                                    </GridColumn>
                                </DataGrid>
                            </LayoutPanel>
                        </Layout>
                    </div>
                    <div class="dialog-button text-center">
<!--                        <LinkButton style="width:80px" @click="buildPurchase">生成采购单</LinkButton>-->
                        <LinkButton style="width:80px" @click="$refs.viewPurchaseorderDlg.close()">关闭</LinkButton>
                    </div>
                </Dialog>
<!--                <Dialog ref="editPurchaseDlg"-->
<!--                        :title="'编辑采购单'"-->
<!--                        :dialogStyle="{width:'80vw',height:'80vh'}"-->
<!--                        bodyCls="f-column"-->
<!--                        :modal="true">-->
<!--                    <div class="f-full">-->
<!--                        <Layout bodyCls="f-column" :border="false">-->
<!--                            <LayoutPanel region="north" style="height:50px;" :border="false">-->
<!--                                <div class="title">North Region</div>-->
<!--                            </LayoutPanel>-->
<!--                            <LayoutPanel region="center" style="height:100%" :border="false">-->
<!--                                <div class="title">Center Region</div>-->
<!--                            </LayoutPanel>-->
<!--                        </Layout>-->
<!--                    </div>-->
<!--                    <div class="dialog-button">-->
<!--                        <LinkButton style="width:80px">Save</LinkButton>-->
<!--                        <LinkButton style="width:80px">Close</LinkButton>-->
<!--                    </div>-->
<!--                </Dialog>-->
            </LayoutPanel>
        </Layout>
        <selectCommodity ref="selectCommodity" @selectCommodity="selectCommodity"></selectCommodity>
    </div>
</template>

<script>
import selectCommodity from '@/components/selectCommodity.vue';
import selectSupplier from '@/components/selectSupplier.vue';
import purchaseView from '@/components/purchaseView.vue';
import selectUser from '@/components/selectUser.vue';
import filterList from '@/components/filterList.vue';

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
            filterString:'',
            timeout: null,
            finish:false
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        selectCommodity, selectUser, selectSupplier, purchaseView, filterList
    },
    methods: {
        onPageChange(event) {
            this.pageNumber = event.pageNumber;
            this.pageSize = event.pageSize;
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.loading = true;
            let vm = this;
            let url = 'purchaseorder/getQueryList';
            if (this.isRedback) {
                url = 'purchase/getQueryListByRedback';
            }
            this.$root.getData(url, {
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString,
                finish:this.finish
            }, function (data) {
                vm.total = data.total;
                vm.data = [];
                data.children.forEach(function (e) {
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
                vm.getData("purchase/save", {obj: JSON.stringify(vm.obj), rows: JSON.stringify(vm.list)}, function (data) {
                    vm.$set(vm.obj, 'id', data.id);
                    // vm.$refs.editPurchaseDlg.close();
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        },
        editPurchase() {
            this.loadMap(this.obj.id);
            this.$refs.purchaseViewDlg.close();
            this.$refs.editPurchaseDlg.open();
        },
        redback() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("purchaseorder/redback", {id: vm.obj.id}, function (data) {
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                    vm.$refs.purchaseViewDlg.close();
                    vm.$refs.editPurchaseDlg.close();
                })
            })
        },
        removeItem(index, obj) {
            if (obj.id > 0) {
                let vm = this;
                this.confirm('确认吗?', function () {
                    vm.getData("purchasechild/delete", {id: obj.id}, function (data) {
                        vm.list.splice(index, 1);
                    })
                })
            } else {
                this.list.splice(index, 1);
            }
        },
        getRowCss(row) {
            if (this.isRedback) {
                return {background: "#f2dede"};
            }
            return null;
        },
        filter(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        },
        viewPurchaseorder(){
            this.$refs.viewPurchaseorderDlg.open();
            let vm = this;
            this.getData("purchaseorder/getChildMaps", {pid:this.obj.id}, function (data) {
                vm.list=data;
            })
        }
    }
}
</script>

<style scoped>

</style>
