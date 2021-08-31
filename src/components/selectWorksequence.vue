<template>
    <div>
        <input v-if="input" type="text" v-model="worksequencename" readonly @click="openDlg" class="form-control">
        <Dialog ref="selectWorksequenceDlg" closed
                :title="'选择'"
                :dialogStyle="{width:'50%',height:'50vh'}"
                :modal="true">
            <DataGrid :columnResizing="true" :bodyStyle="{padding:'5px',border:0}"
                      :border="false"
                      class="f-full"
                      :lazy="true"
                      :data="data"
                      :total="total"
                      selectionMode="single"
                      :loading="loading"
                      @selectionChange="selectItem($event)"
                      :pageNumber="pageNumber"
                      :pageSize="pageSize"
                      @pageChange="onPageChange($event)"
                      :pagination="true"
                      :pagePosition="'bottom'">
                <GridColumn field="number" title="工序编号" align="center"></GridColumn>
                <GridColumn field="name" title="工序名称" align="center"></GridColumn>
                <GridColumn field="price" title="单价" align="center"></GridColumn>
                <GridColumn field="productiontime" title="生产时间(分钟)" align="center"></GridColumn>
                <GridColumn field="content" title="工序内容" align="center"></GridColumn>
            </DataGrid>
        </Dialog>
    </div>
</template>

<script>
export default {
    props:['input','worksequencename'],
    name: "app",
    data() {
        return {
            pageSize: 15,
            pageNumber: 1,
            filterString:'',
            loading: false,
            data:[],
            total:0
        }
    },
    created: function () {
        if(!this.input){
            this.loadPage(this.pageNumber, this.pageSize);
        }
    },
    methods: {
        open(){
            this.$refs.selectWorksequenceDlg.open();
        },
        onPageChange(event) {
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.loading = true;
            let vm = this;
            this.$root.getData("worksequence/getQueryList", {
                limit: pageSize,
                offset: pageSize * (pageNumber-1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString
            }, function (data) {
                vm.total = data.total;
                vm.data=[];
                data.children.forEach(function (e) {
                    vm.data.push(e);
                })
                vm.loading = false;
            })
        },
        selectItem(obj){
            this.$emit('selectWorksequence',obj);
        },
        openDlg(){
            this.$refs.selectWorksequenceDlg.open();
            this.loadPage(this.pageNumber, this.pageSize);
        }
    }
}
</script>

<style scoped>

</style>
