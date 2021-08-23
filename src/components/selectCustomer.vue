<template>
    <div>
        <input v-if="input" type="text" v-model="customername" readonly @click="openDlg" class="form-control">
        <Dialog ref="selectCustomerDlg" closed
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
                <GridColumn field="name" title="名称" align="center"></GridColumn>
                <GridColumn field="area" title="区域" align="center"></GridColumn>
                <GridColumn field="contactperson" title="联系人" align="center"></GridColumn>
                <GridColumn field="contactnumber" title="联系电话" align="center"></GridColumn>
            </DataGrid>
        </Dialog>
    </div>
</template>

<script>
export default {
    props:['input','customername'],
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
            this.$refs.selectCustomerDlg.open();
        },
        onPageChange(event) {
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.loading = true;
            let vm = this;
            this.$root.getData("customer/getQueryList", {
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
            this.customername=obj.name;
            this.$emit('selectCustomer',obj);
            this.$refs.selectCustomerDlg.close();
        },
        openDlg(){
            this.$refs.selectCustomerDlg.open();
            this.loadPage(this.pageNumber, this.pageSize);
        }
    }
}
</script>

<style scoped>

</style>
