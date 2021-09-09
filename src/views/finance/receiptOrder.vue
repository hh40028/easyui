<template>
    <Layout bodyCls="f-column" style="height: calc(100vh - 50px)" :border="false">
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
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column">
            <DataGrid
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
                <GridColumn field="unitname" title="往来单位" align="center"></GridColumn>
                <GridColumn field="receiptdate" title="收款日期" align="center"></GridColumn>
                <GridColumn field="amount" title="收款金额" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ toMoney(scope.row.amount, '￥') }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="wipezero" title="优惠金额" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ toMoney(scope.row.wipezero, '￥') }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="managername" title="经办人" align="center"></GridColumn>
                <GridColumn field="username" title="录入人" align="center"></GridColumn>
                <GridColumn field="remark" title="摘要" width="300" align="center"></GridColumn>
            </DataGrid>
            <Dialog ref="editReceiptOrderDlg" closed
                    :title="'编辑收款单'"
                    :dialogStyle="{width:'500px',height:'450px'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <div class="col-6 p-10">
                        <label>客户名称</label>
                        <selectCustomer :input="true" :customername="obj.name" @selectCustomer="selectCustomer"></selectCustomer>
                    </div>
                    <div class="col-6 p-10">
                        <label>应收余额</label>
                        <input type="number" readonly v-model="obj.overage" class="form-control">
                    </div>
                    <div class="col-6 p-10">
                        <label>收款账户</label>
                        <selectAccount ref="selectAccountCom" :number="'1002'" :input="true" :name="obj.accountname" @selectAccount="selectAccount"></selectAccount>
                    </div>
                    <div class="col-6 p-10">
                        <label>收款金额</label>
                        <input type="number" v-model="obj.amount" class="form-control">
                    </div>
                    <div class="col-6 p-10">
                        <label>优惠金额</label>
                        <input type="number" v-model="obj.wipezero" class="form-control">
                    </div>
                    <div class="col-6 p-10">
                        <label>经办人</label>
                        <selectUser ref="selectUserCom" :input="true" :username="obj.managername" @selectUser="selectUser"></selectUser>
                    </div>
                    <div class="col-12 p-10">
                        <label>摘要说明</label>
                        <textarea style="height: 80px" v-model="obj.remark" class="form-control"></textarea>
                    </div>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="save">保存</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editReceiptOrderDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectCustomer from '@/components/selectCustomer.vue';
import selectAccount from '@/components/selectAccount.vue';
import selectUser from '@/components/selectUser.vue';

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
            filterString: '',
            timeout: null
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        selectCustomer, selectAccount, selectUser
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
            let url = 'receiptorder/getQueryList';
            if (this.isRedback) {
                url = 'receiptorder/getQueryListRedback';
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
        selectObj(obj) {
            this.obj = obj;
        },
        add() {
            this.obj = {};
            this.$refs.editReceiptOrderDlg.open();
        },
        selectCustomer(obj) {
            let vm = this;
            this.getData("statement/getReceivableOverage", {unitid: obj.id}, function (data) {
                vm.$set(vm.obj, 'unitid', obj.id);
                vm.$set(vm.obj, 'name', obj.name);
                if (!data) {
                    vm.$set(vm.obj, 'overage', 0);
                } else {
                    vm.$set(vm.obj, 'overage', data.debit);
                }
            })
        },
        selectAccount(obj) {
            this.$set(this.obj, 'accountid', obj.id);
            this.$set(this.obj, 'accountname', obj.name);
        },
        selectUser(obj) {
            this.$set(this.obj, 'manager', obj.id);
            this.$set(this.obj, 'managername', obj.username);
        },
        save() {
            let vm = this;
            this.getData("receiptorder/save", this.obj, function (data) {
                vm.$refs.editReceiptOrderDlg.close();
                vm.loadPage(vm.pageNumber, vm.pageSize);
            })
        },
        deleteObj() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("receiptorder/redback", {id: vm.obj.id}, function (data) {
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
