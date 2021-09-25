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
                    <DataGrid :data="planworksequences" class="f-full" :border="false">
                        <GridColumn field="number" title="工序编号" align="center"></GridColumn>
                        <GridColumn field="name" title="工序名称" align="center"></GridColumn>
                        <GridColumn field="price" title="生产单价" align="right">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{ toMoney(scope.row.price, '￥') }}
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="productiontime" title="生产时间" align="right">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{ scope.row.productiontime }}分钟
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="productioncount" title="计划数量" align="center"></GridColumn>
                        <GridColumn field="releasecount" title="分派数量" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">{{ !scope.row.releasecount ? 0 : scope.row.releasecount }}
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="finishcount" title="完成数量" align="center"></GridColumn>
                        <GridColumn field="content" title="工序说明" align="left" width="40%"></GridColumn>
                        <GridColumn title="工序分派" align="center" width="80">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    <div v-if="scope.row.releasecount>=scope.row.productioncount">已分派</div>
                                    <div v-if="scope.row.releasecount<scope.row.productioncount" class="c-blue" @click="transfer(scope.row)">分派</div>
                                </div>
                            </template>
                        </GridColumn>
                    </DataGrid>
                </TabPanel>
                <TabPanel :title="'配料表'">
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
                <TabPanel :title="'领料单'">
                    <Panel :bodyStyle="{padding:'5px'}">
                        <LinkButton iconCls="icon-add" :plain="true" @click="editPickinglist">领料</LinkButton>
                        <LinkButton iconCls="icon-ok" :plain="true" :disabled="!pickinglistObj.id" @click="viewPickinglist">查看</LinkButton>
                    </Panel>
                    <DataGrid :data="pickinglist"
                              selectionMode="single"
                              @selectionChange="selectPickinglistObj($event)" class="f-full" :border="false">
                        <GridColumn field="number" title="领料单编号" align="center"></GridColumn>
                        <GridColumn field="applicantname" title="申请人" align="center"></GridColumn>
                        <GridColumn field="applicationtime" title="申请时间" align="center"></GridColumn>
                        <GridColumn field="outstock" title="出库" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item" :class="{'c-teal':scope.row.outstock}">
                                    {{ scope.row.outstock ? "已出库" : "未出库" }}
                                </div>
                            </template>
                        </GridColumn>
                    </DataGrid>
                </TabPanel>
                <TabPanel :title="'退料单'">
                    <Panel :bodyStyle="{padding:'5px'}">
                        <LinkButton iconCls="icon-add" :plain="true" @click="editReturnorder">退料</LinkButton>
                        <LinkButton iconCls="icon-ok" :plain="true" :disabled="!returnorderObj.id" @click="viewReturnorder">查看</LinkButton>
                    </Panel>
                    <DataGrid :data="returnorderList"
                              selectionMode="single"
                              @selectionChange="selectReturnorderObj($event)" class="f-full" :border="false">
                        <GridColumn field="number" title="退料单编号" align="center"></GridColumn>
                        <GridColumn field="applicantname" title="申请人" align="center"></GridColumn>
                        <GridColumn field="applicationtime" title="申请时间" align="center"></GridColumn>
                        <GridColumn field="instock" title="入库" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item" :class="{'c-teal':scope.row.instock}">
                                    {{ scope.row.instock ? "已入库" : "未入库" }}
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
                        <LayoutPanel region="center" style="height:100%" :border="false">
                            <div style="position: absolute;top:10px;right:10px;z-index: 10000000" v-if="pickinglistObj.outstock">
                                <img src="../../assets/images/chuku.png" style="height:50px">
                            </div>
                            <DataGrid v-if="pickinglistObj.children"
                                      :clickToEdit="true" selectionMode="cell" editMode="cell"
                                      :data="pickinglistObj.children" class="f-full" :border="false">
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
                                <GridColumn field="count" title="商品数量" align="center" :editable="true">
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
                    <LinkButton style="width:80px" @click="openSelectCommodity">选择商品</LinkButton>
                    <LinkButton style="width:80px" @click="submit" v-if="!pickinglistObj.submit">提交</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editPickinglistDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
            <Dialog ref="viewPickinglistDlg" closed
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
                        <LayoutPanel region="center" style="height:100%" :border="false">
                            <div style="position: absolute;top:10px;right:10px;z-index: 10000000" v-if="pickinglistObj.outstock">
                                <img src="../../assets/images/chuku.png" style="height:50px">
                            </div>
                            <DataGrid v-if="pickinglistObj.children"
                                      :data="pickinglistObj.children" class="f-full" :border="false">
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
                                <GridColumn field="price" title="出库成本" align="center" :editable="true">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            {{ toMoney(scope.row.price, '￥') }}
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="warehousename" title="出货仓库" align="center"></GridColumn>
                                <GridColumn field="cargolocationnumber" title="出货货位" align="center"></GridColumn>
                            </DataGrid>
                        </LayoutPanel>
                    </Layout>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" v-if="!pickinglistObj.outstock" @click="removePickinglist">删除</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.viewPickinglistDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
            <Dialog ref="editTransferDlg" closed
                    :title="'工序移交'"
                    :dialogStyle="{width:'600px'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <div class="col-6 p-10">
                        <label>移交部门</label>
                        <selectOrganization :input="true" :name="transferObj.deptname" @selectOrganization="selectOrganization"></selectOrganization>
                    </div>
                    <div class="col-6 p-10">
                        <label>移交员工</label>
                        <selectUser :organizationid="transferObj.deptid" :input="true" :username="transferObj.operatorname" @selectUser="selectUser"></selectUser>
                    </div>
                    <div class="col-6 p-10">
                        <label>当前工序</label>
                        <input type="text" class="form-control" readonly v-model="transferObj.finishprocessname">
                    </div>
                    <div class="col-6 p-10">
                        <label>移交数量</label>
                        <input type="number" class="form-control" v-model="transferObj.receiptquantity" :max="transferObj.maxCount">
                    </div>
                    <div class="col-6 p-10">
                        <label>开始时间</label>
                        <input type="date" class="form-control" v-model="transferObj.starttime">
                    </div>
                    <div class="col-6 p-10">
                        <label>完成时间</label>
                        <input type="date" class="form-control" v-model="transferObj.finishtime">
                    </div>
                    <div class="col-12 p-10">
                        <label>备注</label>
                        <textarea rows="3" class="form-control" v-model="transferObj.remark" style="height: 50px"></textarea>
                    </div>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="saveTransferObj">确定</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editTransferDlg.close()">取消</LinkButton>
                </div>
            </Dialog>
            <Dialog ref="editRetureOrderDlg" closed
                    :title="'退料单'"
                    :dialogStyle="{width:'60vw',height:'60vh'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <Layout bodyCls="f-column" :border="false">
                        <LayoutPanel region="center" style="height:100%" :border="false">
                            <div style="position: absolute;top:10px;right:10px;z-index: 10000000" v-if="returnorderObj.outstock">
                                <img src="../../assets/images/chuku.png" style="height:50px">
                            </div>
                            <DataGrid
                                :data="pickinglistchildList" class="f-full" :border="false">
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
                                <GridColumn field="count" title="领料数量" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            {{ scope.row.count }} {{ scope.row.unit }}
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="count" title="退料数量" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <input type="number" v-model="scope.row.returncount" :max="scope.row.count">
                                        </div>
                                    </template>
                                </GridColumn>
                            </DataGrid>
                        </LayoutPanel>
                    </Layout>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="submitReturnorder">提交</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editRetureOrderDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>

            <Dialog ref="viewRetusnorderDlg" closed
                    :title="'退料单'"
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
                                    <td class="text-left">{{ returnorderObj.number }}</td>
                                    <td class="text-right">申请人</td>
                                    <td class="text-left">{{ returnorderObj.applicantname }}</td>
                                    <td class="text-right">申请时间</td>
                                    <td class="text-left">{{ returnorderObj.applicationtime }}</td>
                                </tr>
                                </tbody>
                            </table>
                        </LayoutPanel>
                        <LayoutPanel region="center" style="height:100%" :border="false">
                            <div style="position: absolute;top:10px;right:10px;z-index: 10000000" v-if="returnorderObj.instock">
                                <img src="../../assets/images/ruku.png" style="height:50px">
                            </div>
                            <DataGrid v-if="returnorderObj.children"
                                      :data="returnorderObj.children" class="f-full" :border="false">
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
                                <GridColumn field="count" title="退料数量" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            {{ scope.row.count }} {{ scope.row.unit }}
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="price" title="退料单价" align="right" :editable="true">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            {{ toMoney(scope.row.price, '￥') }}
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="warehousename" title="入货仓库" align="center"></GridColumn>
                                <GridColumn field="cargolocationnumber" title="入货货位" align="center"></GridColumn>
                            </DataGrid>
                        </LayoutPanel>
                    </Layout>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" v-if="!returnorderObj.instock" @click="removeReturnorderObj">删除</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.viewRetusnorderDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
            <selectCommodity ref="selectCommodityCom" @selectCommodity="selectCommodity"></selectCommodity>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectOrganization from '@/components/selectOrganization.vue';
import selectUser from "@/components/selectUser";
import selectCommodity from "@/components/selectCommodity.vue";

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
            planworksequences: [],
            productworksequencechildren: [],
            pickinglistObj: {},
            worksequenceObj: {},
            transferObj: {},
            pickinglist: [],
            returnorderObj: {
                children: []
            },
            pickinglistchildList: [],
            returnorderList:[]
        }
    },
    created: function () {
        this.loadWarehouses();
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        selectUser, selectOrganization, selectCommodity
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
            this.loadPickingList();
            this.loadReturnorderList();
        },
        changeStatus(status) {
            this.obj = {};
            this.status = status;
            this.loadPage(this.pageNumber, this.pageSize);
        },
        loadWorksequence() {
            let vm = this;
            this.getData("planworksequence/getMaps", {planid: this.obj.id}, function (data) {
                vm.planworksequences = [];
                data.forEach(function (e) {
                    if (!e.releasecount) {
                        vm.$set(e, 'releasecount', 0);
                    }
                    vm.planworksequences.push(e);
                })
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
            this.pickinglistObj = {
                children: []
            }
            this.$refs.editPickinglistDlg.open();
            // let vm = this;
            // this.getData("pickinglist/buildPickinglist", {id: this.obj.id}, function (data) {
            //     vm.pickinglistObj = data;
            //     vm.$refs.editPickinglistDlg.open();
            // });
        },
        selectCommodity(obj) {
            this.pickinglistObj.children.push({
                commodityid: obj.id,
                number: obj.number,
                name: obj.name,
                norm: obj.norm,
                model: obj.model,
                unit: obj.unit,
                count: 0
            });
        },
        openSelectCommodity() {
            this.$refs.selectCommodityCom.load();
        },
        submit() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("pickinglist/submit", {
                    planid: vm.obj.id,
                    obj: JSON.stringify(vm.pickinglistObj)
                }, function (data) {
                    vm.msg('操作成功');
                    vm.$refs.editPickinglistDlg.close();
                    vm.pickinglistObj = {};
                    vm.loadPickingList();
                })
            })
        },
        removePickinglist() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("pickinglist/delete", {id: vm.pickinglistObj.id}, function (data) {
                    vm.$refs.viewPickinglistDlg.close();
                    vm.pickinglistObj = {};
                    vm.loadPickingList();
                })
            })
        },
        loadPickingList() {
            let vm = this;
            this.getData("pickinglist/getMaps", {planid: this.obj.id}, function (data) {
                vm.pickinglist = data;
            })
        },
        transfer(obj) {
            this.worksequenceObj = obj;
            this.transferObj = {
                planworksequenceid: obj.id,
                finishprocess: obj.id,
                finishprocessname: obj.name,
                maxCount: obj.productioncount - obj.releasecount
            }
            console.log(obj);
            this.$refs.editTransferDlg.open();
        },
        selectOrganization(obj) {
            this.$set(this.transferObj, 'deptid', obj.id);
            this.$set(this.transferObj, 'deptname', obj.name);
        },
        selectUser(obj) {
            this.$set(this.transferObj, 'operatorid', obj.id);
            this.$set(this.transferObj, 'operatorname', obj.username);
        },
        saveTransferObj() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("worksequencetransfer/save", vm.transferObj, function (data) {
                    vm.$refs.editTransferDlg.close();
                    vm.loadWorksequence();
                })
            })
        },
        selectPickinglistObj(obj) {
            this.pickinglistObj = obj;
            console.log(obj);
        },
        viewPickinglist() {
            let vm = this;
            this.getData("pickinglist/getMapByPlanid", {id: this.pickinglistObj.id}, function (data) {
                vm.pickinglistObj = data;
                vm.$refs.viewPickinglistDlg.open();
            })
        },
        editReturnorder() {
            let vm = this;
            this.getData("pickinglist/getChildByPids", {planid: this.obj.id}, function (data) {
                vm.pickinglistchildList = data;
                vm.$refs.editRetureOrderDlg.open();
            })
        },
        submitReturnorder() {
            let vm = this;
            let commodity = [];
            let err='';
            this.pickinglistchildList.forEach(function (e) {
                if(!isNaN(e.returncount) && parseFloat(e.returncount)>e.count){
                    err='退货数量不可大于领料数量';
                }
                commodity.push({
                    commodityid: e.id,
                    returncount: e.returncount,
                    returnprice: e.price
                });
            })
            if(err){
                this.alert(err);
            }else{
                this.confirm('确认吗?', function () {
                    vm.getData("returnorder/save", {
                        planid: vm.obj.id,
                        rows: JSON.stringify(commodity)
                    }, function (data) {
                        vm.pickinglistchildList = [];
                        vm.$refs.editRetureOrderDlg.close();
                        vm.loadReturnorderList();
                    })
                })
            }
        },
        loadReturnorderList(){
            let vm = this;
            this.getData("returnorder/getMaps", {planid:this.obj.id}, function (data) {
                vm.returnorderList=data;
            })
        },
        selectReturnorderObj(obj){
            this.returnorderObj=obj;
        },
        viewReturnorder(){
            let vm = this;
            this.getData("returnorder/getMap", {id:this.returnorderObj.id}, function (data) {
                vm.returnorderObj=data;
                vm.$refs.viewRetusnorderDlg.open();
            })
        },
        removeReturnorderObj(){
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("returnorder/delete", {id: vm.returnorderObj.id}, function (data) {
                    vm.returnorderObj= {};
                    vm.$refs.viewRetusnorderDlg.close();
                    vm.loadReturnorderList();
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
