<template>
    <div>
        <input v-if="input" type="text" v-model="dictname" readonly @click="openDlg" class="form-control">
        <Dialog ref="selectDictDlg" closed
                :title="'选择'"
                :dialogStyle="{width:'150',height:'50vh'}"
                :modal="true">
            <DataList style="width:250px;height:550px"
                      :data="dicts"
                      selectionMode="single"
                      @selectionChange="selectItem($event)">
                <template slot-scope="scope">
                    <div class="p-10">{{ scope.row.name }}</div>
                </template>
            </DataList>
        </Dialog>
    </div>
</template>

<script>
export default {
    props: ['input', 'dictname','type'],
    name: "app",
    data() {
        return {
            dicts: []
        }
    },
    created: function () {
        if (!this.input) {
            this.loadList();
        }
    },
    methods: {
        loadList(){
            let vm = this;
            this.getData("api/getDictListByKey", {key:this.type}, function (data) {
                vm.dicts=data;
            })
        },
        open() {
            this.$refs.selectDictDlg.open();
            this.loadList();
        },
        selectItem(obj) {
            this.dictname = obj.name;
            this.$emit('selectDict', obj);
            this.$refs.selectDictDlg.close();
        },
        openDlg() {
            this.$refs.selectDictDlg.open();
            this.loadList();
        }
    }
}
</script>

<style scoped>

</style>
