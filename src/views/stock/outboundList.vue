<template>
    <Layout style="height: calc(100vh - 50px)" bodyCls="f-column" :border="false">
        <LayoutPanel region="north">
            <Panel :bodyStyle="{padding:'8px'}" :border="false">
                <LinkButton :disabled="!obj.id" iconCls="icon-ok" :plain="true" @click="view">查看</LinkButton>
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
                      :loading="loading"
                      @rowDblClick="view"
                      @selectionChange="selectObj($event)"
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
                <GridColumn field="number" title="单据号" width="180" align="center"></GridColumn>
                <GridColumn field="status" title="出库状态" width="120" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            <span v-if="scope.row.status===0">未出库</span>
                            <span v-if="scope.row.status===1">已出库</span>
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="customername" title="客户" width="180" align="center"></GridColumn>
                <GridColumn field="relevancenumber" title="关联单号" width="180" align="center"></GridColumn>
                <GridColumn field="outstocktime" title="出库日期" width="120" align="center"></GridColumn>
                <GridColumn field="username" title="录入人" width="100" align="center"></GridColumn>
                <GridColumn field="remark" title="摘要" width="280" align="left"></GridColumn>
            </DataGrid>
            <Dialog ref="viewOutboundDld" closed
                    :title="'出库单明细'"
                    :dialogStyle="{width:'80vw',height:'80vh'}"
                    bodyCls="f-column"
                    :draggable="true"
                    :resizable="true"
                    :modal="true">
                <div class="f-full">
                    <Layout style="height:calc(60vh - 100px);" :border="false" bodyCls="f-column">
                        <LayoutPanel region="north" :border="false">
                            <div v-if="obj.submit" style="position: absolute;top:10px;right:10px;z-index: 10000000">
                                <img src="../../assets/images/chuku.png" style="height:50px">
                            </div>
                            <table border="1" class="w-100">
                                <tbody>
                                <tr>
                                    <td class="text-right" style="width: 25%">单据号</td>
                                    <td class="text-left" style="width: 25%">{{ obj.number }}</td>
                                    <td class="text-right" style="width: 25%">客户名称</td>
                                    <td class="text-left" style="width: 25%">{{ obj.customername }}</td>
                                </tr>
                                <tr>
                                    <td class="text-right" style="width: 25%">关联单号</td>
                                    <td class="text-left" style="width: 25%">{{ obj.relevancenumber }}</td>
                                    <td class="text-right" style="width: 25%">出库日期</td>
                                    <td class="text-left" style="width: 25%">{{ obj.outstocktime }}</td>
                                </tr>
                                </tbody>
                            </table>
                        </LayoutPanel>
                        <LayoutPanel region="center" style="height:100%" :border="false" bodyCls="f-column">
                            <DataGrid v-if="obj.children" :data="obj.children"
                                      class="f-full" :border="false"
                                      @selectionChange="selectItem($event)"
                                      :selectionMode="'single'">
                                <GridColumn title="序号" width="40" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            {{scope.rowIndex+1}}
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="number" title="商品编号" align="center"></GridColumn>
                                <GridColumn field="name" title="商品名称" align="center"></GridColumn>
                                <GridColumn field="norm" title="商品规格" align="center"></GridColumn>
                                <GridColumn field="model" title="商品型号" align="center"></GridColumn>
                                <GridColumn field="outcount" title="出库数量" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            {{ scope.row.outcount }} ({{ scope.row.bigpackage ? scope.row.bigunit : scope.row.unit }})
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="outprice" title="出库单价" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            {{ toMoney(scope.row.outprice) }}
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="warehouseid" title="出货仓库" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <span v-if="obj.submit">{{ scope.row.warehousename }}</span>
                                            <select v-if="!obj.submit" class="w-100" v-model="scope.row.warehouseid" @change="changeWarehouse">
                                                <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
                                            </select>
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="cargolocationid" title="出货货位" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <span v-if="obj.submit">{{ scope.row.cargolocationnumber }}</span>
                                            <selectCargolocation v-if="!obj.submit"
                                                                 :input="true" @selectCargolocationObj="selectCargolocationObj"
                                                                 :warehouseid="scope.row.warehouseid" :name="scope.row.cargolocationnumber">
                                            </selectCargolocation>
                                        </div>
                                    </template>
                                </GridColumn>
                            </DataGrid>
                        </LayoutPanel>
                    </Layout>
                </div>
                <div class="dialog-button">
                    <LinkButton style="width:80px" @click="submit" v-if="!obj.submit">提交出库</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.viewOutboundDld.close()">关闭</LinkButton>
                </div>
            </Dialog>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectCargolocation from '@/components/selectCargolocation.vue';
import filterList from '@/components/filterList.vue';

export default {
    name: "app",
    data() {
        return {
            total: 0,
            pageSize: 25,
            pageNumber: 1,
            data: [],
            loading: false,
            obj: {},
            list: [],
            warehouses: [],
            isRedback: false,
            timeout: null,
            outboundchildObj: {}
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        selectCargolocation, filterList
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
            let url = 'outbound/getQueryList';
            if (this.isRedback) {
                url = 'outbound/getQueryListByRedback';
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
        view() {
            this.$refs.viewOutboundDld.open();
            let vm = this;
            this.getData("warehouse/getList", {}, function (data) {
                vm.warehouses = data;
            })
            this.getData("outbound/getMap", {id: this.obj.id}, function (data) {
                vm.obj = data;
            })
        },
        selectItem(obj) {
            this.outboundchildObj = obj;
        },
        changeWarehouse() {
            this.saveChild();
            this.outboundchildObj.cargolocationid = 0;
            this.outboundchildObj.cargolocationnumber = '';
        },
        saveChild() {
            let vm = this;
            this.getData("outboundchild/save", this.outboundchildObj, function (data) {
            })
        },
        selectCargolocationObj(obj) {
            this.$set(this.outboundchildObj, 'cargolocationid', obj.id);
            this.$set(this.outboundchildObj, 'cargolocationnumber', obj.number);
            this.saveChild();
        },
        submit() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("outbound/submit", {id: vm.obj.id}, function (data) {
                    vm.msg('操作成功');
                    vm.$refs.viewOutboundDld.close();
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        },
        filter(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        }
    }
}
</script>

<style scoped>

</style>
