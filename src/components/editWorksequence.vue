<template>
    <Dialog ref="editWorksequenceDlg" closed
            :title="'编辑'"
            :dialogStyle="{width:'400px',height:'600px'}"
            bodyCls="f-column"
            :modal="true">
        <div class="f-full">
            <div class="col-12 p-10">
                <label>工序编号</label>
                <input type="text" v-model="obj.number" class="form-control">
            </div>
            <div class="col-12 p-10">
                <label>工序名称</label>
                <input type="text" v-model="obj.name" class="form-control">
            </div>
            <div class="col-12 p-10">
                <label>参考单价</label>
                <input type="number" v-model="obj.price" class="form-control">
            </div>
            <div class="col-12 p-10">
                <label>生产时间(分钟)</label>
                <input type="number" v-model="obj.productiontime" class="form-control">
            </div>
            <div class="col-12 p-10">
                <label>生产部门</label>
                <selectOrganization :input="true" :name="obj.productiondeptname" @selectOrganization="selectOrganization"></selectOrganization>
            </div>
            <div class="col-12 p-10">
                <label>工序内容</label>
                <textarea rows="5" style="height: 80px" v-model="obj.content" class="form-control"></textarea>
            </div>
        </div>
        <div class="dialog-button">
            <LinkButton style="width:80px" @click="save">保存</LinkButton>
            <LinkButton style="width:80px" @click="$refs.editWorksequenceDlg.close()">关闭</LinkButton>
        </div>
    </Dialog>
</template>

<script>
import selectOrganization from '@/components/selectOrganization.vue';
export default {
    name: "app",
    data() {
        return {
            obj:{}
        }
    },
    components: {
        selectOrganization
    },
    created: function () {
    },
    methods: {
        open: function () {
            this.$refs.editWorksequenceDlg.open();
        },
        selectOrganization(obj) {
            this.$set(this.obj, 'productiondeptname', obj.text);
            this.$set(this.obj, 'productiondeptid', obj.id);
        },
        save() {
            let vm = this;
            this.getData("worksequence/save", this.obj, function (data) {
                vm.$refs.editWorksequenceDlg.close();
                vm.$emit('worksequenceSave',data);
            })
        }
    }
}
</script>

<style scoped>

</style>
