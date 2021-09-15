<template>
    <Layout style="height: calc(100vh - 52px)" bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'5px'}" :border="false">
                <div class="col-12">
                    <ButtonGroup selectionMode="single">
                        <LinkButton :toggle="true" @click="changeStatus(1)" :selected="status===1">加工中</LinkButton>
                        <LinkButton :toggle="true" @click="changeStatus(2)" :selected="status===2">已完工</LinkButton>
                    </ButtonGroup>
                </div>
            </Panel>
        </LayoutPanel>
        <LayoutPanel v-if="obj.id>0" region="south" style="height:50%;" bodyCls="f-column" :border="false">
            <Tabs class="f-full">
                <TabPanel :title="'工序'">
                    <DataGrid :data="productworksequences" class="f-full" :border="false">
                        <GridColumn field="number" title="工序编号" align="center"></GridColumn>
                        <GridColumn field="name" title="工序名称" align="center"></GridColumn>
                        <GridColumn field="price" title="生产单价" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{ toMoney(scope.row.price, '￥') }}
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="productiontime" title="生产时间(分钟)" align="center"></GridColumn>
                    </DataGrid>
                </TabPanel>
                <TabPanel :title="'配料'">
                    <Panel :bodyStyle="{padding:'5px'}">
                        <LinkButton iconCls="icon-ok" :plain="true" @click="editPickinglist">领料单</LinkButton>
                    </Panel>
                    <DataGrid :data="productworksequencechildren" class="f-full" :border="false">
                        <GridColumn field="number" title="配件编号" align="center"></GridColumn>
                        <GridColumn field="name" title="配件名称" align="center"></GridColumn>
                        <GridColumn field="norm" title="配件规格" align="center"></GridColumn>
                        <GridColumn field="model" title="配件型号" align="center"></GridColumn>
                        <GridColumn field="demandcount" title="需求数量" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{ scope.row.demandcount }} {{ scope.row.unit }}
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="losscount" title="损耗数量" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{ scope.row.losscount }} {{ scope.row.unit }}
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="stockcount" title="库存数量" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{ scope.row.stockcount }} {{ scope.row.unit }}
                                </div>
                            </template>
                        </GridColumn>
                    </DataGrid>
                </TabPanel>
                <TabPanel :title="'验收'">
                    <div class="col-12 p-10" v-if="obj.status<2 && !obj.finish">
                        <div class="col-4 p-10">
                            <label>完成数量</label>
                            <input type="number" v-model="obj.finishcount" :max="obj.plancount" class="form-control">
                        </div>
                        <div class="col-4 p-10">
                            <label>验收时间</label>
                            <input type="date" v-model="obj.finishtime" class="form-control">
                        </div>
                        <div class="col-4 p-10">
                            <label>入货仓库</label>
                            <select v-model="obj.warehouseid" class="form-control">
                                <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
                            </select>
                        </div>
                        <div class="col-12 p-10">
                            <LinkButton btnCls="c1" style="width:120px" @click="submitInbound">提交入库</LinkButton>
                        </div>
                    </div>
                    <div class="col-12 p-10" v-if="obj.status>1 && obj.finish">
                        <div class="col-12 p-10">
                            完成数量：{{ obj.plancount }}
                        </div>
                        <div class="col-12 p-10">
                            验收时间：{{ obj.finishtime }}
                        </div>
                        <div class="col-12 p-10">
                            入货仓库：{{ obj.warehousename }}
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" :border="false" bodyCls="f-column">
            <DataGrid :border="false"
                      class="f-full"
                      :columnResizing="true"
                      :lazy="true"
                      :data="data"
                      :total="total"
                      selectionMode="single"
                      :loading="loading"
                      @selectionChange="selectObj($event)"
                      :pageNumber="pageNumber"
                      :pageSize="pageSize"
                      @pageChange="onPageChange($event)"
                      :pagination="true"
                      :pagePosition="'bottom'">
                <GridColumn field="commoditynumber" title="产品编号" align="center" width="120"></GridColumn>
                <GridColumn field="commodityname" title="产品名称" align="center" width="120"></GridColumn>
                <GridColumn field="number" title="计划单号" align="center" width="240"></GridColumn>
                <GridColumn field="norm" title="产品规格" align="center" width="100"></GridColumn>
                <GridColumn field="model" title="产品型号" align="center" width="100"></GridColumn>
                <GridColumn field="starttime" title="开始日期" align="center" width="100"></GridColumn>
                <GridColumn field="finishtime" title="计划完成日期" align="center" width="100"></GridColumn>
                <GridColumn field="deptname" title="生产车间" align="center" width="120"></GridColumn>
                <GridColumn field="workername" title="生产人" align="center" width="100"></GridColumn>
                <GridColumn field="status" title="加工状态" align="center" width="100">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            <span v-if="scope.row.status===0">新建</span>
                            <span v-if="scope.row.status===1">已下达</span>
                            <span v-if="scope.row.status===2">已完工</span>
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="outstock" title="领料" align="center" width="100">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            <span v-if="!scope.row.outstock">未领料</span>
                            <span class="c-teal" v-if="scope.row.outstock">已领料</span>
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="plancount" title="计划数量" align="center" width="100"></GridColumn>
                <GridColumn field="finishcount" title="当前完成数量" align="center" width="100"></GridColumn>
                <GridColumn field="unitcost" title="完成比例" align="center" width="100">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ (scope.row.finishcount / scope.row.plancount) * 100 }}%
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="unitcost" title="剩余数量" align="center" width="240">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.row.plancount - scope.row.finishcount }}
                        </div>
                    </template>
                </GridColumn>
            </DataGrid>
            <Dialog ref="editPickinglistDlg" closed
                    :title="'领料单'"
                    :dialogStyle="{width:'60vw',height:'60vh'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <Layout bodyCls="f-column" :border="false">
                        <LayoutPanel region="north" :border="false">
                            <table border="1" class="w-100">
                                <tbody>
                                <tr>
                                    <td class="text-right">单据号</td>
                                    <td class="text-left">{{ pickinglistObj.number }}</td>
                                    <td class="text-right">申请人</td>
                                    <td class="text-left">{{ pickinglistObj.applicantname }}</td>
                                    <td class="text-right">申请时间</td>
                                    <td class="text-left">{{ pickinglistObj.applicationtime }}</td>
                                </tr>
                                </tbody>
                            </table>
                        </LayoutPanel>
                        <LayoutPanel region="center" style="height:100%;padding-top: 10px" :border="false">
                            <div style="position: absolute;top:10px;right:10px;z-index: 10000000" v-if="pickinglistObj.outstock">
                                <img src="../../assets/images/chuku.png" style="height:50px">
                            </div>
                            <DataGrid v-if="pickinglistObj.children" :data="pickinglistObj.children" class="f-full" :border="false">
                                <GridColumn title="序号" width="40" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            {{ scope.rowIndex + 1 }}
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="number" title="商品编号" align="center"></GridColumn>
                                <GridColumn field="name" title="商品名称" align="center"></GridColumn>
                                <GridColumn field="norm" title="商品规格" align="center"></GridColumn>
                                <GridColumn field="model" title="商品型号" align="center"></GridColumn>
                                <GridColumn field="count" title="商品数量" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            {{ scope.row.count }} {{ scope.row.unit }}
                                        </div>
                                    </template>
                                </GridColumn>
                            </DataGrid>
                        </LayoutPanel>
                    </Layout>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="submit" v-if="!pickinglistObj.submit">提交</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editPickinglistDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
        </LayoutPanel>
    </Layout>
</template>

<script>
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
            warehouses: [],
            isRedback: false,
            timeout: null,
            statusList: [
                {status: 1, title: '加工'},
                {status: 2, title: '完工'}
            ],
            status: 1,
            productworksequences: [],
            productworksequencechildren: [],
            pickinglistObj: {}
        }
    },
    created: function () {
        this.loadWarehouses();
        this.loadPage(this.pageNumber, this.pageSize);
    },
    methods: {
        loadWarehouses() {
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
            let url = 'productionplan/getWorkorderQueryList';
            this.$root.getData(url, {
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString,
                oid: this.$root.userObj.organizationid,
                status: this.status
            }, function (data) {
                vm.total = data.total;
                vm.data = [];
                data.children.forEach(function (e) {
                    vm.data.push(e);
                })
                vm.loading = false;
            })
        },
        selectObj(obj) {
            console.log(obj);
            this.obj = this.clone(obj);
            this.loadWorksequence();
        },
        changeStatus(status) {
            this.obj = {};
            this.status = status;
            this.loadPage(this.pageNumber, this.pageSize);
        },
        loadWorksequence() {
            let vm = this;
            this.getData("productworksequence/getMaps", {productid: this.obj.commodityid}, function (data) {
                vm.productworksequences = data;
            })
            this.getData("productworksequence/getChildMaps", {productid: this.obj.commodityid}, function (data) {
                vm.productworksequencechildren = [];
                data.forEach(function (e) {
                    e.demandcount *= vm.obj.plancount;
                    e.losscount *= vm.obj.plancount;
                    vm.productworksequencechildren.push(e);
                })
            })
        },
        submitInbound() {
            let vm = this;
            if (!this.obj.warehouseid) {
                this.alert('请选择入货仓库');
            } else {
                this.confirm('确认吗?', function () {
                    vm.getData("productionplan/submitInbound", {
                        id: vm.obj.id,
                        finishcount: vm.obj.finishcount,
                        finishtime: vm.obj.finishtime,
                        warehouseid: vm.obj.warehouseid
                    }, function (data) {
                        vm.obj = {};
                        vm.loadPage(vm.pageNumber, vm.pageSize);
                    })
                })
            }
        },
        editPickinglist() {
            let vm = this;
            this.getData("pickinglist/buildPickinglist", {id: this.obj.id}, function (data) {
                vm.pickinglistObj = data;
                vm.$refs.editPickinglistDlg.open();
            });
        },
        submit(){
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("pickinglist/submit", {id: vm.pickinglistObj.id}, function (data) {
                    vm.msg('操作成功');
                    vm.$refs.editPickinglistDlg.close();
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
