<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'5px'}" :border="false">
<!--                <LinkButton iconCls="icon-ok" :plain="true" @click="view">查看</LinkButton>-->
<!--                <LinkButton iconCls="icon-reload" :plain="true">Reload</LinkButton>-->
                <div class="pull-right">
                    <filterList @filterLoad="filter"></filterList>
                </div>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" :border="false" bodyCls="f-column">
            <DataGrid :border="false"
                      class="f-full"
                      :columnResizing="true"
                      :lazy="true"
                      :data="data"
                      :total="total"
                      :loading="loading"
                      @rowDblClick="view"
                      :pageNumber="pageNumber"
                      :pageSize="pageSize"
                      @pageChange="onPageChange($event)"
                      :pagination="true"
                      :pagePosition="'bottom'"
                      @selectionChange="obj=$event">
                <GridColumn title="序号" width="40" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.rowIndex + 1 }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="plannumber" title="生产计划编号" align="center"></GridColumn>
                <GridColumn field="number" title="产品编号" align="center"></GridColumn>
                <GridColumn field="name" title="产品名称" align="center"></GridColumn>
                <GridColumn field="norm" title="产品规格" align="center"></GridColumn>
                <GridColumn field="model" title="产品型号" align="center"></GridColumn>
                <GridColumn field="finishcount" title="生产数量" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.row.finishcount }} {{ ' ' + scope.row.unit }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="acceptancetime" title="验收日期" align="center"></GridColumn>
                <GridColumn field="username" title="验收人" align="center"></GridColumn>
                <GridColumn field="warehousename" title="入货仓库" align="center"></GridColumn>
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
            obj: {},
            filterString: '',
            timeout: null
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
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
            let url = 'acceptancesheet/getQueryList';
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
        view() {

        },
        filter(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        },
    }
}
</script>

<style scoped>

</style>
