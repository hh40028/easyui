<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" style="height:50px;">
            <div class="col-3 p-5">
                <LinkButton iconCls="icon-add" :plain="true" @click="add">新增</LinkButton>
                <LinkButton iconCls="icon-edit" :disabled="!obj.id" :plain="true" @click="edit">编辑</LinkButton>
                <LinkButton iconCls="icon-reload" :plain="true" @click="loadPage(pageNumber, pageSize)">刷新</LinkButton>
            </div>
            <div class="col-3 p-5"></div>
            <div class="col-3 p-5"></div>
            <div class="col-3 p-5">
                <filterList @filterLoad="filter"></filterList>
            </div>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column">
            <DataGrid style="height: calc(100vh - 100px)"
                      :border="false"
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
                <GridColumn title="序号" width="50" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ (scope.rowIndex+1) }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="number" title="工序编号" align="center" width="130"></GridColumn>
                <GridColumn field="name" title="工序名称" align="center" width="120"></GridColumn>
                <GridColumn field="price" title="参考单价" align="center" width="120">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.row.price|number2 }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="productiontime" title="生产时间(分钟)" align="center" width="150"></GridColumn>
                <GridColumn field="productiondeptname" title="生产部门" align="center" width="150"></GridColumn>
                <GridColumn field="content" title="工序内容"></GridColumn>
            </DataGrid>
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
                        <input type="text" v-model="obj.productiontime" class="form-control">
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
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectOrganization from '@/components/selectOrganization.vue';
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
            list: [],
            filterString: '',
            timeout: null
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        selectOrganization, filterList
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
            let url = "worksequence/getQueryList";
            this.$root.getData(url, {
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
        add() {
            this.obj = {};
            this.$refs.editWorksequenceDlg.open();
        },
        edit() {
            this.$refs.editWorksequenceDlg.open();
        },
        selectOrganization(obj) {
            this.$set(this.obj, 'productiondeptname', obj.text);
            this.$set(this.obj, 'productiondeptid', obj.id);
        },
        save() {
            let vm = this;
            this.getData("worksequence/save", this.obj, function (data) {
                vm.obj = {};
                vm.$refs.editWorksequenceDlg.close();
                vm.loadPage(vm.pageNumber, vm.pageSize);
            })
        },
        deleteObj() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("worksequence/delete", {id: vm.obj.id}, function (data) {
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        },
        filter(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        }
    }
}
</script>

<style scoped>

</style>
