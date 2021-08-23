<template>
    <div>
        <input v-if="input" type="text" v-model="name" readonly @click="openDlg" class="form-control">
        <Dialog ref="selectOrganizationDlg" closed
                :title="'选择部门'"
                :dialogStyle="{width:'300px',height:'50vh'}"
                :modal="true">
            <Tree :data="tree" @selectionChange="selectItem($event)"></Tree>
        </Dialog>
    </div>
</template>

<script>
export default {
    props: ['input', 'name'],
    name: "app",
    data() {
        return {
            tree: []
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
            this.getData("api/getOrgTree", {}, function (data) {
                vm.tree=data;
            })
        },
        open() {
            this.$refs.selectOrganizationDlg.open();
            this.loadList();
        },
        selectItem(obj) {
            this.name = obj.name;
            this.$emit('selectOrganization', obj);
            this.$refs.selectOrganizationDlg.close();
        },
        openDlg() {
            this.$refs.selectOrganizationDlg.open();
            this.loadList();
        }
    }
}
</script>

<style scoped>

</style>
