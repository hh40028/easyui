<template>
    <Layout bodyCls="f-column" style="height: calc(100vh - 52px)" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'8px'}" :border="false">
                <LinkButton iconCls="icon-add" :plain="true" @click="add">新建</LinkButton>
                <LinkButton iconCls="icon-edit" :disabled="!obj.id" :plain="true" @click="edit">编辑</LinkButton>
                <div class="pull-right">
                    <filterList @filterLoad="filter"></filterList>
                </div>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column" :border="false">
            <DataGrid :border="false"
                      class="f-full"
                      :columnResizing="true"
                      :lazy="true"
                      :data="data"
                      :total="total"
                      selectionMode="single"
                      :loading="loading"
                      @rowDblClick="edit()"
                      @selectionChange="selectObj($event)"
                      :pageNumber="pageNumber"
                      :pageSize="pageSize"
                      @pageChange="onPageChange($event)"
                      :pagination="true"
                      :pagePosition="'bottom'">
                <GridColumn field="status" width="40" align="center" :frozen="true">
                    <template slot="header" slot-scope="scope">
                        启用
                    </template>
                    <template slot="body" slot-scope="scope">
                        <input type="checkbox" v-model="scope.row.status" @change="onCheckedChange(scope.row)">
                    </template>
                </GridColumn>
                <GridColumn field="number" title="商品编号" width="80" align="center" :frozen="true"></GridColumn>
                <GridColumn field="name" title="商品名称" width="120" align="center"></GridColumn>
                <GridColumn field="typename" title="商品类型" width="120" align="center"></GridColumn>
                <GridColumn field="norm" title="商品规格" width="120" align="center"></GridColumn>
                <GridColumn field="model" title="商品型号" width="120" align="center"></GridColumn>
                <GridColumn field="unit" title="计量单位" width="120" align="center"></GridColumn>
                <GridColumn field="bigpackage" title="大包装单位" width="120" align="center"></GridColumn>
                <GridColumn field="conversionrelationship" title="大小包换算" width="120" align="center"></GridColumn>
                <GridColumn field="suppliername" title="供应商" width="120" align="center"></GridColumn>
                <GridColumn field="sourcename" title="来源" width="120" align="center"></GridColumn>
                <GridColumn field="remark" width="580" title="备注" align="left"></GridColumn>
            </DataGrid>
            <Dialog ref="d1" closed
                    :title="'编辑商品信息'"
                    :dialogStyle="{width:'60%',height:'60vh'}"
                    :modal="true">
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>商品编号</label><br>
                    <input type="text" class="form-control" v-model="obj.number">
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>商品名称</label><br>
                    <input type="text" class="form-control" v-model="obj.name">
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>商品类别</label><br>
                    <select v-model="obj.typeid" class="form-control">
                        <option v-for="type in types" :key="type.id" :value="type.id">{{ type.name }}</option>
                    </select>
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>商品规格</label><br>
                    <input type="text" class="form-control" v-model="obj.norm">
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>商品型号</label><br>
                    <input type="text" class="form-control" v-model="obj.model">
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>计量单位</label>
                    <select v-model="obj.unit" class="form-control">
                        <option v-for="unit in units" :key="unit.name" :value="unit.name">{{ unit.name }}</option>
                    </select>
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>大包装单位</label><br>
                    <input type="text" class="form-control" v-model="obj.bigpackage">
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>大小包装换算</label><br>
                    <input type="text" class="form-control" v-model="obj.conversionrelationship">
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>采购单价</label><br>
                    <input type="number" class="form-control" v-model="obj.purchaseprice">
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>销售单价</label><br>
                    <input type="number" class="form-control" v-model="obj.saleprice">
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>用途</label><br>
                    <input type="text" class="form-control" v-model="obj.use">
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>产地</label><br>
                    <input type="text" class="form-control" v-model="obj.origin">
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>供应商</label>
                    <selectSupplier :input="true" :suppliername="obj.suppliername" @selectSupplier="selectSupplier"></selectSupplier>
                    <!--                    <ComboBox class="w-100 form-control" valueField="id" textField="name" v-model="obj.supplierid" :data="suppliers"></ComboBox>-->
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>条码</label><br>
                    <input type="text" class="form-control" v-model="obj.barcode">
                </div>
                <div class="col-4 p-t-15 p-l-15 p-r-15 ">
                    <label>来源</label>
                    <select v-model="obj.source" class="form-control">
                        <option v-for="source in sources" :key="source.id" :value="source.id">{{ source.name }}</option>
                    </select>
                </div>
                <div class="col-12 p-t-15 p-l-15 p-r-15 ">
                    <label>备注</label><br>
                    <textarea rows="5" style="height: 50px" class="form-control" v-model="obj.remark"></textarea>
                </div>
                <template slot="footer">
                    <div class="text-center p-5">
                        <LinkButton class="m-r-10" iconCls="icon-save" @click="save">保存</LinkButton>
                        <LinkButton iconCls="icon-cancel" @click="$refs.d1.close()">关闭</LinkButton>
                    </div>
                </template>
            </Dialog>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectSupplier from '@/components/selectSupplier.vue';
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
            suppliers: [],
            units: [],
            types: [],
            sources: [],
            timeout: null
        }
    },
    components: {
        selectSupplier, filterList
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
        this.loadSuppliers();
    },
    methods: {
        loadSuppliers: function () {
            let vm = this;
            this.getData("supplier/getList", {}, function (data) {
                vm.suppliers = data;
            })
            this.$root.getData("api/getDictList", {}, function (data) {
                data.forEach(function (e) {
                    if (e.key === 'jiliangdanwei') {
                        vm.units.push(e);
                    }
                    if (e.key === 'chanpinleibie') {
                        vm.types.push(e);
                    }
                    if (e.key === 'shangPinLeiYuan') {
                        vm.sources.push(e);
                    }
                })
            })
        },
        onPageChange(event) {
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.loading = true;
            let vm = this;
            this.$root.getData("commodity/getQueryList", {
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
            this.obj={};
            this.$refs.d1.open();
        },
        edit() {
            this.$refs.d1.open();
        },
        save() {
            let vm = this;
            this.getData("commodity/save", this.obj, function (data) {
                vm.$refs.d1.close();
                vm.data = [];
                vm.loadPage(vm.pageNumber, vm.pageSize);
            })
        },
        onCheckedChange(obj) {
            this.obj = obj;
            let vm = this;
            this.getData("commodity/save", this.obj, function (data) {
                vm.$refs.d1.close();
                vm.loadPage(vm.pageNumber, vm.pageSize);
            })
        },
        selectSupplier(obj) {
            this.$set(this.obj, 'supplierid', obj.id);
            this.$set(this.obj, 'suppliername', obj.name);
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
