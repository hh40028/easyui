<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'5px'}" :border="false">
                <LinkButton iconCls="icon-add" :plain="true" @click="add">新建</LinkButton>
                <LinkButton iconCls="icon-edit" :disabled="!obj.id" :plain="true" @click="edit">编辑</LinkButton>
                <LinkButton iconCls="icon-cut" :disabled="!obj.id" :plain="true" @click="copy">复制</LinkButton>
                <div class="pull-right">
                    <filterList @filterLoad="filter"></filterList>
                </div>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column" :border="false">
            <Panel :bodyStyle="{padding:'0'}" class="f-full" bodyCls="f-column">
                <DataGrid :border="false"
                          class="f-full"
                          :columnResizing="true"
                          :lazy="true"
                          :data="data"
                          :total="total"
                          selectionMode="single"
                          :loading="loading"
                          @selectionChange="selectObj($event)"
                          :pageNumber="pageNumber"
                          :pageSize="pageSize"
                          @pageChange="onPageChange($event)"
                          :pagination="true"
                          :pagePosition="'bottom'">
                    <GridColumn title="序号" width="40" align="center">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                {{ scope.rowIndex + 1 }}
                            </div>
                        </template>
                    </GridColumn>
                    <GridColumn field="id" title="主键" width="80" align="center"></GridColumn>
                    <GridColumn field="name" title="字典名称" width="120" align="center"></GridColumn>
                    <GridColumn field="key" title="键名" width="180" align="center"></GridColumn>
                    <GridColumn field="type" title="分类" width="180" align="center"></GridColumn>
                    <GridColumn field="pid" title="上级编号" width="120" align="center"></GridColumn>
                </DataGrid>
                <Dialog ref="editDictDlg" closed
                        :title="'编辑字典'"
                        :draggable="true"
                        :resizable="true"
                        :dialogStyle="{width:'400px'}"
                        bodyCls="f-column"
                        :modal="true">
                    <div class="f-full">
                        <div class="col-12 p-10">
                            <label>字典名称</label>
                            <input type="text" v-model="obj.name" class="form-control">
                        </div>
                        <div class="col-12 p-10">
                            <label>字典键名</label>
                            <input type="text" v-model="obj.key" class="form-control">
                        </div>
                        <div class="col-12 p-10">
                            <label>分组名称</label>
                            <input type="text" v-model="obj.type" class="form-control">
                        </div>
                        <div class="col-12 p-10">
                            <label>上级编号</label>
                            <input type="number" v-model="obj.pid" class="form-control">
                        </div>
                    </div>
                    <div class="dialog-button">
                        <LinkButton style="width:80px" @click="save">保存</LinkButton>
                        <LinkButton style="width:80px" @click="$refs.editDictDlg.close()">关闭</LinkButton>
                    </div>
                </Dialog>
            </Panel>
        </LayoutPanel>
    </Layout>
</template>

<script>
import filterList from '@/components/filterList.vue';
export default {
    name: "app",
    data() {
        return {
            total: 0,
            pageSize: 15,
            pageNumber: 1,
            data: [],
            loading: false,
            obj: {},
            filterString: '',
            timeout: null
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        filterList
    },
    methods: {
        onPageChange(event) {
            this.pageNumber = event.pageNumber;
            this.pageSize = event.pageSize;
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.loading = true;
            let vm = this;
            let url = 'api/getDictQueryList';
            this.$root.getData(url, {
                tablename: 'dict',
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString
            }, function (data) {
                vm.total = data.total;
                vm.data = [];
                data.children.forEach(function (e) {
                    vm.data.push(e);
                })
                vm.loading = false;
            })
        },
        selectObj(obj) {
            this.obj = this.clone(obj);
        },
        add(){
            this.obj={};
            this.$refs.editDictDlg.open();
        },
        edit(){
            this.$refs.editDictDlg.open();
        },
        copy(){
            let obj={
                name:'',
                key:this.obj.key,
                type:this.obj.type,
                pid:this.obj.pid
            }
            this.obj=obj;
            this.$refs.editDictDlg.open();
        },
        save(){
            let vm = this;
            this.getData("api/saveDict", this.obj, function (data) {
                vm.$refs.editDictDlg.close();
                vm.loadPage(vm.pageNumber, vm.pageSize);
            })
        },
        filter(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        },
    }
}
</script>

<style scoped>

</style>
