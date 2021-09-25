<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'8px'}" :border="false">
                <LinkButton iconCls="icon-ok" class="m-r-5" :disabled="!returnorderObj.id" :plain="true" @click="view">查看</LinkButton>

                <ButtonGroup selectionMode="single" class="m-l-30">
                    <LinkButton :toggle="true" :selected="!instock" @click="changeStatus(false)">未入库</LinkButton>
                    <LinkButton :toggle="true" :selected="instock" @click="changeStatus(true)">已入库</LinkButton>
                </ButtonGroup>
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
                <GridColumn field="number" title="领料单号" align="center"></GridColumn>
                <GridColumn field="plannumber" title="加工单号" align="center"></GridColumn>
                <GridColumn field="applicantname" title="申请人" align="center"></GridColumn>
                <GridColumn field="applicationtime" title="申请时间" align="center"></GridColumn>
            </DataGrid>
            <Dialog ref="returnorderDlg" closed
                    :title="'领料单明细'"
                    :dialogStyle="{width:'80vw',height:'80vh'}"
                    bodyCls="f-column"
                    :border="false"
                    :draggable="true"
                    :resizable="true"
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
                        <LayoutPanel region="center" style="height:100%;padding-top: 10px" :border="false">
                            <DataGrid v-if="returnorderObj.children"
                                      :data="returnorderObj.children"
                                      class="f-full"
                                      :border="false"
                                      selectionMode="single"
                                      @selectionChange="selectItem($event)">
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
                                <GridColumn field="warehouseid" title="入货仓库" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <span v-if="returnorderObj.instock">{{ scope.row.warehousename }}</span>
                                            <select v-if="!returnorderObj.instock" class="w-100" v-model="scope.row.warehouseid" @change="changeWarehouse(scope.row)">
                                                <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
                                            </select>
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="count" title="入货货位" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <span v-if="returnorderObj.instock">{{ scope.row.cargolocationnumber }}</span>
                                            <selectCargolocation v-if="!returnorderObj.instock"
                                                                 :input="true" @selectCargolocationObj="selectCargolocationObj"
                                                                 :warehouseid="scope.row.warehouseid"
                                                                 :name="scope.row.cargolocationnumber"
                                                                 :commodityid="scope.row.commodityid"></selectCargolocation>
                                        </div>
                                    </template>
                                </GridColumn>
                            </DataGrid>
                        </LayoutPanel>
                    </Layout>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" v-if="!returnorderObj.instock" @click="inbound">入库</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.returnorderDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectCargolocation from '@/components/selectCargolocation.vue';
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
            returnorderObj: {
                children: []
            },
            list: [],
            warehouses: [],
            isRedback: false,
            filterString: '',
            timeout: null,
            instock: false
        }
    },
    created: function () {
        this.loadWarehouses();
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        filterList, selectCargolocation
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
            let url = 'returnorder/getQueryList';
            this.$root.getData(url, {
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString,
                instock: this.instock
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
            let vm = this;
            this.getData("returnorder/getMap", {id: obj.id}, function (data) {
                vm.returnorderObj = data;
            })
        },
        filterLoad(fs) {
            this.filterString = fs;
            this.loadPage(this.pageNumber, this.pageSize);
        },
        view() {
            this.$refs.returnorderDlg.open();
        },
        selectItem(obj) {
            this.row = obj;
        },
        selectCargolocationObj(obj) {
            this.$set(this.row, 'cargolocationid', obj.id);
            this.$set(this.row, 'cargolocationnumber', obj.number);
        },
        changeWarehouse(obj){
            this.$set(obj, 'cargolocationid', 0);
            this.$set(obj, 'cargolocationnumber', '');
        },
        inbound() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("returnorder/instock", {
                    id: vm.returnorderObj.id,
                    rows: JSON.stringify(vm.returnorderObj.children)
                }, function (data) {
                    vm.msg('操作成功');
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                    vm.$refs.returnorderDlg.close();
                })
            })
        },
        changeStatus(flag) {
            this.instock = flag;
            this.loadPage(this.pageNumber, this.pageSize);
        },
        getRowCss(row) {
            if (row.redback) {
                return {background: "#f2dede"};
            }
            return null;
        },
    }
}
</script>

<style scoped>

</style>
