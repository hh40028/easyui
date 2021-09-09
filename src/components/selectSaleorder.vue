<template>
    <div>
    <Dialog ref="viewSaleorderDlg" closed
            :title="'销售订单列表'"
            :dialogStyle="{width:'80vw',height:'80vh'}"
            :modal="true">
        <Layout style="width:100%;height:calc(80vh - 40px);" bodyCls="f-column" :border="false">
            <LayoutPanel region="north" :border="false">
                <div class="pull-right p-5">
                    <filterList @filterLoad="filterLoad"></filterList>
                </div>
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
                          @selectionChange="selectObj($event)"
                          :pageNumber="pageNumber"
                          :pageSize="pageSize"
                          @pageChange="onPageChange($event)"
                          :pagination="true"
                          :pagePosition="'bottom'">
                    <GridColumnGroup :frozen="true" align="left" width="200">
                        <GridHeaderRow>
                            <GridColumn title="序号" width="40" align="center" :frozen="true">
                                <template slot="body" slot-scope="scope">
                                    <div class="item">
                                        {{ scope.rowIndex + 1 }}
                                    </div>
                                </template>
                            </GridColumn>
                            <GridColumn field="number" title="单据号" width="160" align="center"></GridColumn>
                        </GridHeaderRow>
                    </GridColumnGroup>
                    <GridColumnGroup>
                        <GridHeaderRow>
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
                        </GridHeaderRow>
                    </GridColumnGroup>
                </DataGrid>
            </LayoutPanel>
        </Layout>
    </Dialog></div>
</template>

<script>
import filterList from '../components/filterList.vue';
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
            filterString: '',
            timeout: null
        }
    },
    components: {
        filterList
    },
    created: function () {
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
            this.$emit('getSaleorder',obj);
            this.$refs.viewSaleorderDlg.close();
        },
        filterLoad(filterString){
            this.filterString=filterString;
            this.loadPage(this.pageNumber, this.pageSize)
        },
        open(){
            this.$refs.viewSaleorderDlg.open();
            this.loadPage(this.pageNumber, this.pageSize);
        }
    }
}
</script>

<style scoped>

</style>
