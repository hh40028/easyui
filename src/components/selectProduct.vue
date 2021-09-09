<template>
    <Dialog ref="selectProductDlg" closed
            :title="'选择产品'"
            :dialogStyle="{width:'80vw',height:'80vh'}"
            :modal="true">
        <div class="f-full">
            <DataGrid :border="false"
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
                <GridColumn field="number" title="产品编号" align="center"></GridColumn>
                <GridColumn field="name" title="产品名称" align="center"></GridColumn>
                <GridColumn field="typename" title="产品类别" align="center"></GridColumn>
                <GridColumn field="norm" title="产品规格" align="center"></GridColumn>
                <GridColumn field="model" title="产品型号" align="center"></GridColumn>
            </DataGrid>
        </div>
    </Dialog>
</template>

<script>

export default {
    props: ['single'],
    name: "app",
    data() {
        return {
            total: 0,
            pageSize: 15,
            pageNumber: 1,
            data: [],
            loading: false,
            obj: {},
            filterString: ''
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
            let url = 'productstructure/getQueryList';
            this.$root.getData(url, {
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString
            }, function (data) {
                vm.total = data.total;
                vm.data = data.children;
                vm.loading = false;
            })
        },
        selectObj(obj) {
            this.$emit("selectProduct", obj);
        },
        open(){
            this.$refs.selectProductDlg.open();
        }
    }
}
</script>

<style scoped>

</style>
