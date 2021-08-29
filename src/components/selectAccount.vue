<template>
    <div>
        <input v-if="input" type="text" readonly v-model="name" class="form-control" @click="open">
        <Dialog ref="selectAccountDlg" closed
                :title="'选择账户'"
                :dialogStyle="{width:'30%',height:'400px'}"
                :modal="true">
            <DataGrid class="f-full"
                      selectionMode="single"
                      :data="accounts"
                      @selectionChange="selectRow($event)"
                      style="width:100%;height:100%">
                <GridColumn field="name" title="名称"></GridColumn>
            </DataGrid>
        </Dialog>
    </div>
</template>

<script>
export default {
    props: {
        input: Boolean,
        name: String,
        number:String
    },
    name: "app",
    data() {
        return {
            accounts: []
        }
    },
    created: function () {
        this.load();
    },
    methods: {
        load: function () {
            let vm = this;
            this.$root.getData("accountingsubjects/getChildList", {number:this.number}, function (data) {
                vm.accounts = data;
            })
        },
        open() {
            this.$refs.selectAccountDlg.open();
            if (!this.accounts.length) {
                this.load();
            }
        },
        selectRow(obj) {
            this.$refs.selectAccountDlg.close();
            this.$emit('selectAccount', obj);
        }
    }
}
</script>

<style scoped>

</style>
