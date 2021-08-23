<template>
    <div>
        <Layout bodyCls="f-column" style="height:calc(100vh - 50px);" :border="false">
            <LayoutPanel region="north" style="height:60px;">
                <div class="col-3 p-10">
                    <select v-model="warehouseid" class="form-control" @change="loadPage(pageNumber, pageSize)">
                        <option v-for="w in warehouses" :key="w.id" :value="w.id">{{w.name}}</option>
                    </select>
                </div>
                <div class="col-6 p-10"></div>
                <div class="col-3 p-10">
                    <SearchBox class="form-control"
                               placeholder="过滤..."
                               v-model="filterString"
                               @search="onSearch($event)">
                        <Addon>
                            <span v-if="filterString" class="textbox-icon icon-clear" title="Clear value" @click="filterString=null"></span>
                        </Addon>
                    </SearchBox>
                </div>
            </LayoutPanel>
            <LayoutPanel region="center" style="height:100%">
                <DataGrid style="height: calc(100vh - 100px)"
                          :border="false"
                          class="f-full"
                          :columnResizing="true"
                          :lazy="true"
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
                    <GridColumnGroup :frozen="true" align="left" width="240">
                        <GridHeaderRow>
                            <GridColumn title="序号" width="40" align="center" :frozen="true">
                                <template slot="body" slot-scope="scope">
                                    <div class="item">
                                        {{ scope.rowIndex + 1 }}
                                    </div>
                                </template>
                            </GridColumn>
                            <GridColumn field="warehousename" title="仓库" width="120" align="center"></GridColumn>
                            <GridColumn field="cargolocationnumber" title="货位" width="120" align="center"></GridColumn>
                        </GridHeaderRow>
                    </GridColumnGroup>
                    <GridColumnGroup>
                        <GridHeaderRow>
                            <GridColumn field="number" title="商品编号" width="180" align="center"></GridColumn>
                            <GridColumn field="name" title="商品名称" width="180" align="center"></GridColumn>
                            <GridColumn field="norm" title="规格" width="120" align="center"></GridColumn>
                            <GridColumn field="model" title="型号" width="120" align="center"></GridColumn>
                            <GridColumn field="unit" title="单位" width="100" align="center"></GridColumn>
                            <GridColumn field="stockprice" title="库存均价" width="120" align="center"></GridColumn>
                            <GridColumn field="stockcount" title="库存数量" width="120" align="center"></GridColumn>
                            <GridColumn field="amount" title="合计" width="120" align="center"></GridColumn>
                        </GridHeaderRow>
                    </GridColumnGroup>
                </DataGrid>
            </LayoutPanel>
        </Layout>
    </div>
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
            filterString:'',
            warehouseid:0,
            warehouses:[
                {id:0,name:'全部仓库'}
            ],
        }
    },
    created: function () {
        this.loadWarehouses();
        this.loadPage(this.pageNumber, this.pageSize);
    },
    methods: {
        loadWarehouses: function () {
            let vm = this;
            this.getData("warehouse/getList", {}, function (data) {
                data.forEach(function (e){
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
            let vm = this;
            let url = 'stock/getQueryList';
            this.$root.getData(url, {
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString,
                warehouseid:this.warehouseid
            }, function (data) {
                vm.total = data.total;
                vm.data = [];
                data.children.forEach(function (e) {
                    if(!isNaN(e.stockprice)){
                        e.stockprice=e.stockprice.toFixed(2);
                    }
                    if(!isNaN(e.stockcount)){
                        e.stockcount=e.stockcount.toFixed(2);
                    }
                    if(!isNaN(e.amount)){
                        e.amount=e.amount.toFixed(2);
                    }
                    vm.data.push(e);
                })
                vm.loading = false;
            })
        },
        selectObj(obj) {
            this.obj = this.clone(obj);
        },
        onSearch(e){

        }
    }
}
</script>

<style scoped>

</style>
