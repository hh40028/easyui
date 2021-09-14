<template>
        <Layout bodyCls="f-column" :border="false">
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
            filterString:'',
            timeout: null,
            finish:false
        }
    },
    created: function () {
        this.loadPage(this.pageNumber,this.pageSize);
    },
    components: {
        filterList
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
            this.$emit("selectPurchaseorder",obj);
        },
    }
}
</script>

<style scoped>

</style>
