<template>
    <Layout bodyCls="f-column" style="height:calc(100vh - 52px);" :border="false">
        <LayoutPanel region="north" style="height:50px;">
            <div class="col-3 p-5">
                <LinkButton iconCls="icon-add" :plain="true" @click="add">新建</LinkButton>
                <LinkButton iconCls="icon-edit" :disabled="!obj.id" :plain="true" @click="edit">编辑</LinkButton>
            </div>
            <div class="col-3 p-5"></div>
            <div class="col-3 p-5"></div>
            <div class="col-3 p-5">
                <input type="text" class="form-control" v-model="filterString" placeholder="过滤...">
            </div>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" :border="false">
            <DataGrid style="height: calc(100vh - 99px)"
                      class="f-full"
                      :columnResizing="true"
                      :lazy="true"
                      :data="data"
                      :total="total"
                      selectionMode="single"
                      :loading="loading"
                      @selectionChange="selectObj($event)"
                      @rowDblClick="edit"
                      :pageNumber="pageNumber"
                      :pageSize="pageSize"
                      @pageChange="onPageChange($event)"
                      :pagination="true"
                      :pagePosition="'bottom'">
                <GridColumnGroup :frozen="true" align="left" width="80">
                    <GridHeaderRow>
                        <GridColumn title="序号" width="40" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{ scope.rowIndex + 1 }}
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn title="启用" width="40" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    <input type="checkbox" v-model="scope.row.status" @change="changeStatus(scope.row)">
                                </div>
                            </template>
                        </GridColumn>
                    </GridHeaderRow>
                </GridColumnGroup>
                <GridColumnGroup>
                    <GridHeaderRow>
                        <GridColumn field="name" title="名称" width="180" align="center"></GridColumn>
                        <GridColumn field="area" title="地址" width="120" align="center"></GridColumn>
                        <GridColumn field="contactperson" title="联系人" width="120" align="center"></GridColumn>
                        <GridColumn field="contactnumber" title="联系电话" width="120" align="center"></GridColumn>
                        <GridColumn field="paymentdays" title="付款账期(天)" width="120" align="center"></GridColumn>

                    </GridHeaderRow>
                </GridColumnGroup>
            </DataGrid>
            <Dialog ref="editSupplierDlg" closed
                    :title="'编辑供应商信息'"
                    :dialogStyle="{width:'400px',height:'470px'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <div class="col-12 p-10">
                        <label>名称</label>
                        <input type="text" class="form-control" v-model="obj.name">
                    </div>
                    <div class="col-12 p-10">
                        <label>地址</label>
                        <input type="text" class="form-control" v-model="obj.area">
                    </div>
                    <div class="col-12 p-10">
                        <label>联系人</label>
                        <input type="text" class="form-control" v-model="obj.contactperson">
                    </div>
                    <div class="col-12 p-10">
                        <label>联系电话</label>
                        <input type="text" class="form-control" v-model="obj.contactnumber">
                    </div>
                    <div class="col-12 p-10">
                        <label>付款账期(天)</label>
                        <input type="text" class="form-control" v-model="obj.paymentdays">
                    </div>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="save">保存</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editSupplierDlg.close()">关闭</LinkButton>
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
            total: 0,
            pageSize: 15,
            pageNumber: 1,
            data: [],
            loading: false,
            obj: {
                children: []
            },
            list: [],
            filterString:'',
            timeout:null
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
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
            let url = 'supplier/getQueryList';
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
        add() {
            this.obj = {};
            this.$refs.editSupplierDlg.open();
        },
        edit() {
            this.$refs.editSupplierDlg.open();
        },
        selectObj(obj) {
            this.obj = this.clone(obj);
        },
        changeStatus(obj) {
            this.obj = this.clone(obj);
            this.save();
        },
        save() {
            let vm = this;
            this.getData("supplier/save", this.obj, function (data) {
                vm.$refs.editSupplierDlg.close();
                vm.obj = {};
                vm.loadPage(vm.pageNumber, vm.pageSize);
            })
        }
    },
    watch: {
        filterString: {
            handler() {
                let vm = this;
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                }, 500);
            }
        }
    },
}
</script>

<style scoped>

</style>
