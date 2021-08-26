<template>
    <div>
        <input v-if="input" type="text" v-model="name" :class="{'form-control':form,'w-100':!form}" @click="open">
        <Dialog ref="selectCargolocationDlg" closed
                :title="'选择货位'"
                :dialogStyle="{width:'30%',height:'400px'}"
                :modal="true">
            <Tree :data="data" @selectionChange="selection($event)"></Tree>
        </Dialog>
    </div>
</template>

<script>
export default {
    props: {
        warehouseid: Number,
        input: Boolean,
        name: String,
        form: Boolean
    },
    name: "app",
    data() {
        return {
            data: []
        }
    },
    created: function () {
    },
    methods: {
        load: function () {
            let vm = this;
            if(!this.warehouseid){
                this.alert('请先选择仓库');
            }else{
                this.getData("cargolocation/getTreeNotWarehouse", {warehouseId: this.warehouseid}, function (data) {
                    vm.data =data;
                })
            }
        },
        open() {
            this.$refs.selectCargolocationDlg.open();
            if (!this.data.length) {
                this.load();
            }
        },
        selection(obj) {
            this.$refs.selectCargolocationDlg.close();
            this.$emit('selectCargolocationObj', obj);
        }
    }
}
</script>

<style scoped>

</style>
