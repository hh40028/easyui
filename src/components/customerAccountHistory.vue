<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'8px'}" :border="false">
                <LinkButton :disabled="!obj.id" :plain="false">关联单据</LinkButton>
            </Panel>
        </LayoutPanel>
        <LayoutPanel bodyCls="f-column" region="center" style="height:100%" :border="false">
            <DataGrid
                :border="false"
                class="f-full"
                :data="data"
                :total="total"
                selectionMode="single"
                :loading="loading"
                @selectionChange="selectObj($event)"
                :pageNumber="pageNumber"
                :pageSize="pageSize"
                :rowCss="getRowCss"
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

                <GridColumn field="number" title="关联单号" align="center"></GridColumn>
                <GridColumn field="occurrencedate" title="发生日期" align="center"></GridColumn>
                <GridColumn field="debit" title="借方发生" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">{{ toMoney(scope.row.debit,'￥') }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="credit" title="贷方发生" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">{{ toMoney(scope.row.credit,'￥') }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="begin" title="期初" align="center" width="40">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            <span v-if="scope.row.begin">✔️</span>
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="remark" title="摘要" align="left" width="30%"></GridColumn>
            </DataGrid>
        </LayoutPanel>
    </Layout>
</template>

<script>
export default {
    props: {
        unitid: Number,
        name: String,
        accountid:Number
    },
    name: "app",
    data() {
        return {
            total: 0,
            pageSize: 10,
            pageNumber: 1,
            data: [],
            loading: false,
            obj: {},
            filterString: '',
            timeout: null
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
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
            let url = 'statement/getQueryListByUnit';
            this.$root.getData(url, {
                unitid: this.unitid,
                accountid:this.accountid,
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString,
            }, function (data) {
                vm.total = data.total;
                vm.data = [];
                data.children.forEach(function (e) {
                    vm.data.push(e);
                })
                vm.loading = false;
            })
        },
        getRowCss(row) {
            if (row.redback) {
                return {background: "#f2dede"};
            }
            return null;
        },
        selectObj(obj) {
            this.obj = obj;
        }
    }
}
</script>

<style scoped>

</style>
