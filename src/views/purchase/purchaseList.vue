<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'8px'}" :border="false">
                <LinkButton iconCls="icon-add" :plain="true" @click="add">开单</LinkButton>
                <LinkButton iconCls="icon-ok" :disabled="!obj.id" :plain="true" @click="viewPurchase">查看</LinkButton>
                <LinkButton iconCls="icon-search" :plain="true" @click="viewPurchaseorder">采购订单</LinkButton>
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
                      @rowDblClick="viewPurchase"
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
                <GridColumn field="inbound" title="入库" width="80" align="center"></GridColumn>
                <GridColumn field="number" title="单据号" width="120" align="center"></GridColumn>
                <GridColumn field="suppliername" title="供应商" width="180" align="center"></GridColumn>
                <GridColumn field="deptname" title="采购部门" width="180" align="center"></GridColumn>
                <GridColumn field="purchasedate" title="采购日期" width="120" align="center"></GridColumn>
                <GridColumn field="amount" title="采购金额" width="100" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ toMoney(scope.row.amount, '￥') }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="managername" title="经办人" width="120" align="center"></GridColumn>
                <GridColumn field="username" title="编制人" width="120" align="center"></GridColumn>
                <GridColumn field="remark" title="摘要" width="280" align="left"></GridColumn>
            </DataGrid>
            <Dialog ref="editPurchaseDlg" closed
                    :title="'编辑采购单'"
                    :dialogStyle="{width:'80vW',height:'80vH'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <Layout bodyCls="f-column">
                        <LayoutPanel region="north" style="height:150px;">
                            <div class="col-4 p-t-10 p-l-10 p-r-10">
                                <label>供应商</label>
                                <selectSupplier input="true" :suppliername="obj.suppliername" @selectSupplier="selectSupplier"></selectSupplier>
                            </div>
                            <div class="col-4 p-t-10 p-l-10 p-r-10">
                                <label>经办人</label>
                                <selectUser input="true" :username="obj.managername" @selectUser="selectUser"></selectUser>
                            </div>
                            <div class="col-4 p-t-10 p-l-10 p-r-10">
                                <label>采购日期</label>
                                <input type="date" v-model="obj.purchasedate" class="form-control">
                            </div>
                            <div class="col-12 p-10">
                                <label>摘要说明</label>
                                <input type="text" v-model="obj.remark" class="form-control">
                            </div>
                        </LayoutPanel>
                        <LayoutPanel region="center" style="height:100%">
                            <DataGrid :columnResizing="true"
                                      :bodyStyle="{padding:'5px',border:0}"
                                      class="f-full"
                                      :border="false"
                                      :data="list"
                                      idField="id">

                                <GridColumn field="warehouseid" title="入货仓库" width="150">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <select class="w-100" v-model="scope.row.warehouseid">
                                                <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
                                            </select>
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="number" title="商品编号" align="center"></GridColumn>
                                <GridColumn field="name" title="商品名称" align="center"></GridColumn>
                                <GridColumn field="norm" title="商品规格" align="center"></GridColumn>
                                <GridColumn field="model" title="商品型号" align="center"></GridColumn>
                                <GridColumn field="unit" title="商品单位" align="center"></GridColumn>
                                <!--                            <GridColumn field="bigpackage" title="商品单位" align="center">-->
                                <!--                                <template slot="body" slot-scope="scope">-->
                                <!--                                    <div class="item">-->
                                <!--                                        <input type="radio" :name="scope.row.commodityid+'group'" :value="false" v-model="scope.row.bigpackage">{{ scope.row.unit }}-->
                                <!--                                        <input v-if="scope.row.bigunit" type="radio" :name="scope.row.commodityid+'group'" :value="true" v-model="scope.row.bigpackage">{{ scope.row.bigunit }}-->
                                <!--                                    </div>-->
                                <!--                                </template>-->
                                <!--                            </GridColumn>-->
                                <GridColumn field="commoditycount" title="商品数量" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <input type="number" class="w-100 text-center" v-model="scope.row.commoditycount">
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="commodityprice" title="商品单价" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <input type="number" class="w-100 text-center" v-model="scope.row.commodityprice">
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="amount" title="金额" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                        <span v-if="!isNaN(scope.row.commoditycount) && !isNaN(scope.row.commodityprice)">
                                        {{ scope.row.commoditycount * scope.row.commodityprice |number2 }}
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
                    <LinkButton style="width:80px" @click="openSelectCommodityDlg">选择商品</LinkButton>
                    <LinkButton style="width:80px" @click="save">保存单据</LinkButton>
                    <LinkButton style="width:80px" v-if="obj.id>0" @click="submit">提交入库</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editPurchaseDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>

            <Dialog ref="purchaseViewDlg" closed
                    :title="'采购单明细'"
                    :dialogStyle="{width:'80vW',height:'80vH'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <purchaseView :id="obj.id"></purchaseView>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" v-if="!obj.submit" @click="submit">提交入库</LinkButton>
                    <LinkButton style="width:80px" v-if="!obj.submit" @click="editPurchase">编辑</LinkButton>
                    <LinkButton style="width:80px" @click="redback">删除</LinkButton>
                    <LinkButton style="width:80px" @click="printPDF">打印</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.purchaseViewDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
            <Dialog ref="viewPurchaseorderDlg" closed
                    :title="'采购订单'"
                    :dialogStyle="{width:'80vw',height:'80vh'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <selectPurchaseorder ref="purchaseorderCom" @selectPurchaseorder="selectPurchaseorder"></selectPurchaseorder>
                </div>
            </Dialog>
            <selectCommodity ref="selectCommodity" @selectCommodity="selectCommodity"></selectCommodity>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectCommodity from '@/components/selectCommodity.vue';
import selectSupplier from '@/components/selectSupplier.vue';
import purchaseView from '@/components/purchaseView.vue';
import selectUser from '@/components/selectUser.vue';
import filterList from '@/components/filterList.vue';
import selectPurchaseorder from '@/components/selectPurchaseorder.vue';

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
        selectCommodity, selectUser, selectSupplier, purchaseView, filterList, selectPurchaseorder
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
            let url = 'purchase/getQueryList';
            if (this.isRedback) {
                url = 'purchase/getQueryListByRedback';
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
            let err = '';
            let c = 0;
            this.list.forEach(function (e) {
                c++;
                if (!e.warehouseid) {
                    err += '第' + c + '行未选中仓库<br>';
                }
                if (isNaN(e.commoditycount)) {
                    err += '第' + c + '行商品数量格式错误<br>';
                }
                if (isNaN(e.commodityprice)) {
                    err += '第' + c + '行商品单价格式错误<br>';
                }
            })
            if (err.length > 0) {
                this.alert(err);
            } else {
                this.confirm('确认吗?', function () {
                    vm.getData("purchase/save", {obj: JSON.stringify(vm.obj), rows: JSON.stringify(vm.list)}, function (data) {
                        vm.$set(vm.obj, 'id', data.id);
                        vm.loadPage(vm.pageNumber, vm.pageSize);
                    })
                })
            }
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
        loadMap: function (id) {
            let vm = this;
            this.getData("purchase/getMap", {id: id}, function (data) {
                vm.obj = data.obj;
                vm.list = data.list;
                console.log(vm.list);
            })
        },
        viewPurchase() {
            if (this.obj.id > 0) {
                this.$refs.purchaseViewDlg.open();
            }
        },
        editPurchase() {
            this.loadMap(this.obj.id);
            this.$refs.purchaseViewDlg.close();
            this.$refs.editPurchaseDlg.open();
        },
        redback() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("purchase/redback", {id: vm.obj.id}, function (data) {
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
        filter(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        },
        viewPurchaseorder() {
            this.$refs.viewPurchaseorderDlg.open();
        },
        selectPurchaseorder(obj) {
            let vm = this;
            this.confirm('从该订单生成采购单，确认吗?', function () {
                vm.getData("purchaseorder/buildPurchase", {id: obj.id}, function (data) {
                    console.log(data);
                    vm.obj = data.obj;
                    vm.list = data.list;
                    vm.$refs.viewPurchaseorderDlg.close();
                    vm.$refs.editPurchaseDlg.open();
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
