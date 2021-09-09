<template>
    <Layout bodyCls="f-column" style="height:calc(100vh - 50px);" :border="false">
        <LayoutPanel region="north">
            <div class="col-6 p-5">
                <input type="radio" name="type" v-model="type" :value="'1'" @change="load" id="a1"><label for="a1" class="m-r-5">资产类</label>
                <input type="radio" name="type" v-model="type" :value="'2'" @change="load" id="a2"><label for="a2" class="m-r-5">负债类</label>
                <input type="radio" name="type" v-model="type" :value="'4'" @change="load" id="a3"><label for="a3" class="m-r-5">权益类</label>
                <input type="radio" name="type" v-model="type" :value="'5'" @change="load" id="a4"><label for="a4" class="m-r-5">成本类</label>
                <input type="radio" name="type" v-model="type" :value="'6'" @change="load" id="a5"><label for="a5" class="m-r-5">损益类</label>
            </div>
            <div class="col-6 p-5">
                <LinkButton :disabled="!obj.id" iconCls="icon-edit" :plain="true" @click="edit">编辑</LinkButton>
                <LinkButton :disabled="!obj.id" iconCls="icon-add" :plain="true" @click="addChild">增加下级科目</LinkButton>
            </div>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column">
            <TreeGrid
                      class="f-full"
                      :border="false"
                      :striped="true"
                      :columnResizing="true"
                      selectionMode="single"
                      :data="tree" @selectionChange="selectObj($event)"
                      idField="id" treeField="name">
                <GridColumn field="id" title="主键" width="100"></GridColumn>
                <GridColumn field="name" title="名称" width="200"></GridColumn>
                <GridColumn field="number" title="编号" align="left" width="130"></GridColumn>
                <GridColumn field="direction" title="余额方向" align="center" width="120">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.row.direction?"借":"贷" }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn  align="center" width="820"></GridColumn>
            </TreeGrid>
            <Dialog ref="editSubjectsDlg" closed
                    :title="'编辑科目'"
                    :dialogStyle="{width:'400px',height:'320px'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <div class="col-12 p-10">
                        <label>科目编号</label>
                        <input type="text" v-model="obj.number" class="form-control">
                    </div>
                    <div class="col-12 p-10">
                        <label>科目名称</label>
                        <input type="text" v-model="obj.name" class="form-control">
                    </div>
                    <div class="col-12 p-10">
                        <label>余额方向</label><br>
                        <input type="radio" v-model="obj.direction" :value="true">借方 <br>
                        <input type="radio" v-model="obj.direction" :value="false">贷方
                    </div>
                </div>
                <div class="dialog-button">
                    <LinkButton style="width:80px" @click="save">保存</LinkButton>
                    <LinkButton style="width:80px" @click="deleteObj(obj)">删除</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editSubjectsDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
            <Dialog ref="editSubjectsChildDlg" closed
                    :title="'编辑科目'"
                    :dialogStyle="{width:'400px',height:'320px'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <div class="col-12 p-10">
                        <label>科目编号</label>
                        <input type="text" v-model="child.number" class="form-control">
                    </div>
                    <div class="col-12 p-10">
                        <label>科目名称</label>
                        <input type="text" v-model="child.name" class="form-control">
                    </div>
                    <div class="col-12 p-10">
                        <label>余额方向</label><br>
                        <input type="radio" v-model="child.direction" :value="true">借方 <br>
                        <input type="radio" v-model="child.direction" :value="false">贷方
                    </div>
                </div>
                <div class="dialog-button">
                    <LinkButton style="width:80px" @click="saveChild">保存</LinkButton>
                    <LinkButton style="width:80px" @click="deleteObj(child)">删除</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editSubjectsChildDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
        </LayoutPanel>
    </Layout>
</template>

<script>
export default {
    name: "app",
    data() {
        return {
            type: '1',
            tree: [],
            obj: {},
            child: {}
        }
    },
    created: function () {
        this.load();
    },
    methods: {
        load: function () {
            let vm = this;
            this.getData("accountingsubjects/getTree", {type: this.type}, function (data) {
                vm.tree = data;
            })
        },
        selectObj(obj) {
            this.obj = {
                id:obj.id,
                name:obj.name,
                number:obj.number,
                state:obj.state,
                text:obj.text,
                direction:obj.direction,
                children:obj.children
            };
        },
        edit() {
            this.$refs.editSubjectsDlg.open();
        },
        save() {
            let vm = this;
            this.getData("accountingsubjects/save", this.obj, function (data) {
                vm.$refs.editSubjectsDlg.close();
                vm.load();
            })
        },
        addChild() {
            let vm = this;
            let maxNumber = 0;
            this.obj.children.forEach(function (e) {
                if (e.number.substr(0, vm.obj.number.length) === vm.obj.number) {
                    if (parseInt(e.number) > maxNumber) {
                        maxNumber = e.number;
                    }
                }
            })
            if ((maxNumber + '').length === this.obj.number.length) {
                maxNumber = maxNumber + '01';
            } else {
                ++maxNumber;
            }
            console.log(maxNumber);
            this.child = {
                number: maxNumber,
                name: '',
                direction: true
            }
            this.$refs.editSubjectsChildDlg.open();
        },
        saveChild() {
            let vm = this;
            this.getData("accountingsubjects/save", this.child, function (data) {
                vm.$refs.editSubjectsChildDlg.close();
                vm.load();
            })
        },
        deleteObj(obj) {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("accountingsubjects/delete", {id: obj.id}, function (data) {
                    vm.$refs.editSubjectsDlg.close();
                    vm.$refs.editSubjectsChildDlg.close();
                    vm.load();
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
