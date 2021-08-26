<template>
    <Dialog ref="selectCommodityDlg" closed
            :title="'选择商品'"
            :dialogStyle="{width:'60vW',height:'60vH'}"
            :modal="true">
        <DataGrid :columnResizing="true" :bodyStyle="{padding:'5px',border:0}"
                  :data="list"
                  idField="id" style="height:60vh"
                  :selectionMode="'single'"
                  @selectionChange="selectItem($event)">
            <GridColumn field="number" title="商品编号"></GridColumn>
            <GridColumn field="name" title="商品名称"></GridColumn>
            <GridColumn field="norm" title="商品规格" align="right"></GridColumn>
            <GridColumn field="model" title="商品型号" align="right"></GridColumn>
            <GridColumn field="unit" title="计量单位" width="30%"></GridColumn>
            <GridColumn field="remark" title="备注说明" align="center"></GridColumn>
        </DataGrid>
    </Dialog>
</template>

<script>
export default {
    props:['single'],
    data() {
        return {
            list: [],
            filterString: '',
            selection: null
        }
    },
    created() {
    },
    methods: {
        load() {
            this.$refs.selectCommodityDlg.open();
            this.loadList();
        },
        loadList: function () {
            let offset = 0;
            let limit = 15;
            let vm = this;
            this.$root.getData("commodity/getQueryEnableList", {
                limit: limit,
                offset: offset,
                sort: "id",
                direction: "desc",
                filterString: this.filterString
            }, function (data) {
                vm.list = [];
                data.children.forEach(function (e) {
                    vm.list.push(e);
                })
                console.log(vm.list);

            })
        },
        selectItem(obj) {
            this.$emit("selectCommodity", obj);
            if(this.single){
                this.$refs.selectCommodityDlg.close();
            }
        },
    },
    watch: {
        filterString: {
            handler() {
                let vm = this;
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    vm.loadList();
                }, 500);
            }
        }
    },

}
</script>
