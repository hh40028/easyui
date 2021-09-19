<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'8px'}" :border="false">
                <select v-model="warehouseid" class="form-control m-r-30" style="width:200px" @change="loadPage(pageNumber, pageSize)">
                    <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
                </select>
                <ButtonGroup selectionMode="single">
                    <LinkButton :toggle="true" :selected="!group" @click="changeGroup(false)">详细统计</LinkButton>
                    <LinkButton :toggle="true" :selected="group" @click="changeGroup(true)">分组统计</LinkButton>
                </ButtonGroup>
                <div class="pull-right">
                    <filterList @filterLoad="filter"></filterList>
                </div>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column" :border="false">
            <DataGrid v-if="!group"
                      :border="false"
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
                <GridColumn title="序号" width="40" align="center" :frozen="true">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.rowIndex + 1 }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="warehousename" title="仓库" width="120" align="center" :frozen="true"></GridColumn>
                <GridColumn field="cargolocationnumber" title="货位" width="120" align="center"></GridColumn>
                <GridColumn field="number" title="商品编号" width="180" align="center"></GridColumn>
                <GridColumn field="name" title="商品名称" width="180" align="center"></GridColumn>
                <GridColumn field="norm" title="规格" width="120" align="center"></GridColumn>
                <GridColumn field="model" title="型号" width="120" align="center"></GridColumn>
                <GridColumn field="stockcount" title="库存数量" width="120" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.row.stockcount }}{{ ' ' + scope.row.unit }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="stockprice" title="库存均价" width="120" align="right"></GridColumn>
                <GridColumn field="amount" title="合计" width="120" align="right"></GridColumn>
            </DataGrid>
            <DataGrid v-if="group"
                      :border="false"
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
                <GridColumn title="序号" width="40" align="center" :frozen="true">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.rowIndex + 1 }}
                        </div>
                    </template>
                </GridColumn>
                <!--                    <GridColumn field="warehousename" title="仓库" width="120" align="center" :frozen="true"></GridColumn>-->
                <GridColumn field="number" title="商品编号" width="180" align="center"></GridColumn>
                <GridColumn field="name" title="商品名称" width="180" align="center"></GridColumn>
                <GridColumn field="norm" title="规格" width="120" align="center"></GridColumn>
                <GridColumn field="model" title="型号" width="120" align="center"></GridColumn>
                <GridColumn field="unit" title="单位" width="100" align="center"></GridColumn>
                <GridColumn field="stockcount" title="库存数量" width="120" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.row.stockcount }}{{ ' ' + scope.row.unit }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="stockprice" title="库存均价" width="120" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ toMoney(scope.row.stockprice, '￥') }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="stockprice" title="合计" width="120" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ toMoney(scope.row.stockprice*scope.row.stockcount, '￥') }}
                        </div>
                    </template>
                </GridColumn>
            </DataGrid>
        </LayoutPanel>
        <LayoutPanel region="south">
            <div class="col-6 p-10">本页合计：{{toMoney(pageAmountTotal,'￥')}}</div>
            <div class="col-6 p-10">总计：{{toMoney(amountTotal,'￥')}}</div>
        </LayoutPanel>
    </Layout>
</template>

<script>

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
            filterString: '',
            group: false,
            warehouseid: 0,
            warehouses: [
                {id: 0, name: '全部仓库'}
            ],
            pageAmountTotal:0,
            amountTotal:0
        }
    },
    created: function () {
        this.loadWarehouses();
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        filterList
    },
    methods: {
        loadWarehouses: function () {
            let vm = this;
            this.getData("warehouse/getList", {}, function (data) {
                data.forEach(function (e) {
                    vm.warehouses.push(e);
                })
            })
        },
        onPageChange(event) {
            this.pageNumber = event.pageNumber;
            this.pageSize = event.pageSize;
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.loading = true;
            this.pageAmountTotal=0;
            this.amountTotal=0;
            let vm = this;
            let url = 'stock/getQueryList';
            if (this.group) {
                url = 'stock/getGroupQueryList';
            }
            this.$root.getData(url, {
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString,
                warehouseid: this.warehouseid
            }, function (data) {
                vm.total = data.total;
                vm.amountTotal=data.amountTotal;
                vm.data = [];
                data.children.forEach(function (e) {
                    if(url === 'stock/getQueryList'){
                        vm.pageAmountTotal+=e.stockprice*e.stockcount;
                    }
                    if(url === 'stock/getGroupQueryList'){
                        vm.pageAmountTotal+=e.stockprice*e.stockcount;
                    }
                    if (!isNaN(e.stockprice)) {
                        e.stockprice = e.stockprice.toFixed(2);
                    }
                    if (!isNaN(e.stockcount)) {
                        e.stockcount = e.stockcount.toFixed(2);
                    }
                    if (!isNaN(e.amount)) {
                        e.amount = e.amount.toFixed(2);
                    }
                    vm.data.push(e);
                })
                vm.loading = false;
            })
        },
        selectObj(obj) {
            this.obj = this.clone(obj);
        },
        filter(fs) {
            this.filterString = fs;
            this.loadPage(this.pageNumber, this.pageSize);
        },
        changeGroup(flag) {
            this.group = flag;
            this.loadPage(this.pageNumber, this.pageSize);
        }
    }
}
</script>

<style scoped>

</style>
