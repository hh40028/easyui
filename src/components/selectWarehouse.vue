<template>
    <div>
        <input v-if="input" type="text" v-model="name" class="form-control" @click="open">
        <Dialog ref="selectWarehouseDlg" closed
                :title="'选择仓库'"
                :dialogStyle="{width:'30%',height:'400px'}"
                :modal="true">
            <DataGrid class="f-full"
                      selectionMode="single"
                      :data="warehouses"
                      @selectionChange="selectRow($event)"
                      style="width:100%;height:100%">
                <GridColumn field="name" title="仓库名称"></GridColumn>
                <GridColumn field="managername" title="负责人"></GridColumn>
            </DataGrid>
        </Dialog>
    </div>
</template>

<script>
export default {
    props: {
        input: Boolean,
        name: String
    },
    name: "app",
    data() {
        return {
            warehouses: []
        }
    },
    created: function () {
        this.load();
    },
    methods: {
        load: function () {
            let vm = this;
            this.$root.getData("warehouse/getList", {}, function (data) {
                vm.warehouses = [];
                data.forEach(function (e) {
                    if (e.checking) {
                        e.checking = "盘点中...";
                    }
                    vm.warehouses.push(e);
                })
            })
        },
        open() {
            this.$refs.selectWarehouseDlg.open();
            if (!this.warehouses.length) {
                this.load();
            }
        },
        selectRow(obj) {
            this.$refs.selectWarehouseDlg.close();
            this.$emit('selectWarehouse', obj);
        }
    }
}
</script>

<style scoped>

</style>
