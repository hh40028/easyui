<template>
    <Layout bodyCls="f-column" style="height: calc(100vh - 50px)">
        <LayoutPanel region="north" style="height:50px;">
            <div class="col-6">
                <Panel :bodyStyle="{padding:'8px'}" :border="false">
                    <LinkButton iconCls="icon-add" :plain="true" @click="add">新增</LinkButton>
                    <LinkButton :disabled="!obj.id" iconCls="icon-remove" :plain="true" @click="deleteObj">删除</LinkButton>
                </Panel>
            </div>
            <div class="col-6 text-right p-t-7 p-r-15">
                <SearchBox style="width:300px"
                           placeholder="过滤..."
                           v-model="value"
                           @search="onSearch($event)">
                    <Addon>
                        <span v-if="value" class="textbox-icon icon-clear" title="Clear value" @click="value=null"></span>
                    </Addon>
                </SearchBox>
            </div>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%">
            <DataGrid style="height: calc(100vh - 101px)"
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
                <GridColumn title="序号" align="center" width="50">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.rowIndex + 1 }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="number" title="单据号" align="center"></GridColumn>
                <GridColumn field="name" title="客户名称" align="center"></GridColumn>
                <GridColumn field="entrydate" title="录入日期" align="center"></GridColumn>
                <GridColumn field="receivables" title="应收金额" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ toMoney(scope.row.receivables,'￥') }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="remark" title="摘要" width="300" align="center"></GridColumn>
            </DataGrid>
            <Dialog ref="editCustomerBeginDlg" closed
                    :title="'编辑客户期初'"
                    :dialogStyle="{width:'400px',height:'380px'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <div class="col-12 p-10">
                        <label>客户名称</label>
                        <selectCustomer :input="true" :customername="obj.name" @selectCustomer="selectCustomer"></selectCustomer>
                    </div>
                    <div class="col-12 p-10">
                        <label>应收金额</label>
                        <input type="number" v-model="obj.receivables" class="form-control">
                    </div>
                    <div class="col-12 p-10">
                        <label>摘要说明</label>
                        <textarea style="height: 80px" v-model="obj.remark" class="form-control"></textarea>
                    </div>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="save">保存</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editCustomerBeginDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectCustomer from '@/components/selectCustomer.vue';
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
            isRedback: false,
            filterString:'',
            timeout:null
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        selectCustomer
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
            let url = 'customerbegin/getQueryList';
            if (this.isRedback) {
                url = 'customerbegin/getQueryListRedback';
            }
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
        selectObj(obj){
            this.obj=obj;
        },
        add(){
            this.obj={};
            this.$refs.editCustomerBeginDlg.open();
        },
        selectCustomer(obj){
            this.$set(this.obj,'customerid',obj.id);
            this.$set(this.obj,'name',obj.name);
        },
        save(){
            let vm = this;
            this.getData("customerbegin/save", this.obj, function (data) {
                vm.$refs.editCustomerBeginDlg.close();
                vm.loadPage(vm.pageNumber, vm.pageSize);
            })
        },
        deleteObj(){
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("customerbegin/redback", {id: vm.obj.id}, function (data) {
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
