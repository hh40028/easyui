<template>
    <Layout bodyCls="f-column" style="height:calc(100vh - 50px);">
        <LayoutPanel region="north" style="height:50px;">
            <div class="col-3 p-5">
                <LinkButton iconCls="icon-add" :plain="true" @click="add">新增</LinkButton>
                <LinkButton iconCls="icon-view" :disabled="!obj.id" :plain="true" @click="view">查看</LinkButton>
            </div>
            <div class="col-3 p-5">
                <input class="m-t-5" type="checkbox" v-model="isRedback"
                       @change="loadPage(pageNumber, pageSize)" id="ck">
                <label for="ck" :class="{'c-red':isRedback}">显示删除</label>
            </div>
            <div class="col-3 p-5"></div>
            <div class="col-3 p-5">
                <input type="text" class="form-control" v-model="filterString" placeholder="过滤...">
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
                <GridColumn title="序号" width="40" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.rowIndex + 1 }}
                        </div>
                    </template>
                </GridColumn>

                <GridColumn field="number" title="单据号" width="180" align="center"></GridColumn>
                <GridColumn field="warehousename" title="仓库名称" width="180" align="center"></GridColumn>
                <GridColumn field="entrydate" title="入库日期" width="180" align="center"></GridColumn>
                <GridColumn field="remark" title="摘要说明" width="180" align="center"></GridColumn>
            </DataGrid>
            <Dialog ref="editDirectstorageDlg" closed
                    :title="'编辑'"
                    :dialogStyle="{width:'80vw',height:'80vh'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <Panel :bodyStyle="{padding:'5px'}" :border="false">
                        <div class="col-4 p-10">
                            <label>选择仓库</label>
                            <selectWarehouse ref="selectWarehouse" input="true" :name="obj.warehousename" @selectWarehouse="selectWarehouse"></selectWarehouse>
                        </div>
                        <div class="col-4 p-10">
                            <label>选择仓库</label>
                            <input type="date" v-model="obj.entrydate" class="form-control">
                        </div>
                        <div class="col-4 p-10">
                            <label>摘要说明</label>
                            <input type="text" v-model="obj.remark" class="form-control">
                        </div>
                    </Panel>
                    <DataGrid :columnResizing="true" class="f-full"
                              :bodyStyle="{padding:'5px',border:0}"
                              :border="false"
                              :data="list"
                              idField="id">

                        <GridColumn title="序号" align="center" width="50">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{ scope.rowIndex + 1 }}
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="number" title="商品编号" align="center"></GridColumn>
                        <GridColumn field="name" title="商品名称" align="center"></GridColumn>
                        <GridColumn field="norm" title="商品规格" align="center"></GridColumn>
                        <GridColumn field="model" title="商品型号" align="center"></GridColumn>
                        <GridColumn field="bigpackage" title="商品单位" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    <input type="radio" :name="scope.row.commodityid+'group'" :value="false" v-model="scope.row.bigpackage">{{ scope.row.unit }}
                                    <input v-if="scope.row.bigunit" type="radio" :name="scope.row.commodityid+'group'" :value="true" v-model="scope.row.bigpackage">{{ scope.row.bigunit }}
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="commoditycount" title="入库数量" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    <input type="number" v-model="scope.row.incount" class="w-100 text-center" onclick="select()">
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="commodityprice" title="入库单价" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    <input type="number" v-model="scope.row.inprice" class="w-100 text-center" onclick="select()">
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn title="选择货位" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    <input type="text" v-model="scope.row.cargolocationnumber" @click="selectRow(scope.row)" class="w-100 text-center" onclick="select()">
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn title="移除" align="center" width="50">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    <a class="c-red" @click="removeItem(scope.rowIndex,scope.row)">移除</a>
                                </div>
                            </template>
                        </GridColumn>
                    </DataGrid>

                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="openCommodityDlg">选择商品</LinkButton>
                    <LinkButton style="width:80px" @click="submit">提交</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editDirectstorageDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
            <Dialog ref="viewDirectstorageDlg" closed
                    :title="'直接入库单明细'"
                    :dialogStyle="{width:'80vw',height:'80vh'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <directstorageView :id="obj.id"></directstorageView>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" v-if="!obj.submit" @click="edit">编辑</LinkButton>
                    <LinkButton style="width:80px">打印</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.viewDirectstorageDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>

            <selectCommodity ref="selectCommodityCom" @selectCommodity="selectCommodity"></selectCommodity>
            <selectCargolocation ref="selectCargolocationDlg"
                                 :warehouseid="obj.warehouseid"
                                 @selectCargolocationObj="selectCargolocationValue">
            </selectCargolocation>

        </LayoutPanel>
    </Layout>
</template>

<script>
import selectCommodity from "@/components/selectCommodity";
import selectWarehouse from "@/components/selectWarehouse.vue";
import selectCargolocation from "@/components/selectCargolocation.vue";
import directstorageView from "@/components/directstorageView.vue";

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
            timeout: null,
            dicts: [],
            files: [],
            row: {},
            isRedback: false
        }
    },
    created: function () {
        this.loadDicts();
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        selectCommodity, selectWarehouse, selectCargolocation, directstorageView
    },
    methods: {
        loadDicts() {
            let vm = this;
            this.getData("api/getDictList", {}, function (data) {
                vm.dicts = data;
            })
        },
        onPageChange(event) {
            this.pageNumber = event.pageNumber;
            this.pageSize = event.pageSize;
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.obj={};
            this.list=[];
            this.loading = true;
            let vm = this;
            let url = 'directstorage/getQueryList';
            if (this.isRedback) {
                url = 'directstorage/getQueryListByRedback';
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
            this.list = [];
            this.$refs.editDirectstorageDlg.open();
        },
        selectCommodity(obj) {
            console.log(obj);
            let flag = false;
            this.list.forEach(function (e) {
                if (e.commodityid === obj.id) {
                    flag = true;
                }
            })
            if (!flag) {
                let c = {
                    commodityid: obj.id,
                    name: obj.name,
                    number: obj.number,
                    norm: obj.norm,
                    model: obj.model,
                    unit: obj.unit,
                    bigunit: obj.bigpackage,
                    bigpackage: false,
                    conversionrelationship: obj.conversionrelationship
                }
                this.list.push(c);
            } else {
                this.alert("已选商品");
            }
        },
        selectWarehouse(obj) {
            this.$set(this.obj, 'warehouseid', obj.id);
            this.$set(this.obj, 'warehousename', obj.name);
        },
        openCommodityDlg() {
            this.$refs.selectCommodityCom.load();
        },
        removeItem(index, obj) {
            let vm = this;
            if (obj.id > 0) {
                this.confirm('确认吗?', function () {
                    vm.getData("directstoragechild/delete", {id: obj.id}, function (data) {
                        vm.list.splice(index, 1);
                    })
                })
            } else {
                this.list.splice(index, 1);
            }
        },
        selectCargolocationValue(obj) {
            this.$set(this.row, 'cargolocationid', obj.id);
            this.$set(this.row, 'cargolocationnumber', obj.text);
        },
        selectRow(row) {
            this.row = row;
            this.$refs.selectCargolocationDlg.open();
        },
        submit() {
            let vm = this;
            this.$root.confirm('确认吗?', function () {
                vm.getData("directstorage/save", {
                    obj: JSON.stringify(vm.obj),
                    rows: JSON.stringify(vm.list)
                }, function (data) {
                    vm.$refs.editDirectstorageDlg.close();
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        },
        view() {
            let vm = this;
            this.$root.getData("directstoragechild/getViewList", {did: this.obj.id}, function (data) {
                vm.list = data;
                vm.$refs.viewDirectstorageDlg.open();
            })
        },
        edit() {
            this.$refs.editDirectstorageDlg.open();
            this.$refs.viewDirectstorageDlg.close();
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
