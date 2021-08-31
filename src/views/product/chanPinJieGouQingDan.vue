<template>
    <div>
        <Layout bodyCls="f-column" style="height:calc(100vh - 50px);" :border="false">
            <LayoutPanel region="north" style="height:50px;">
                <div class="col-6 p-5">
                    <LinkButton iconCls="icon-add" :plain="true" @click="add">新增</LinkButton>
                    <LinkButton iconCls="icon-edit" :disabled="!selectCommodityObj" :plain="true" @click="edit">编辑</LinkButton>
                    <LinkButton iconCls="icon-edit" :disabled="!selectCommodityObj" :plain="true" @click="worksequenceSet">工序设置</LinkButton>
                    <LinkButton iconCls="icon-reload" :plain="true" @click="load">刷新</LinkButton>
                </div>
                <div class="col-3 p-5"></div>
                <div class="col-3 p-5">
                    <filterList @filterLoad="load" :placeholder="'过滤名称和编码'"></filterList>
                </div>
            </LayoutPanel>
            <LayoutPanel region="center" style="height:100%" bodyCls="f-column">
                <TreeGrid style="height: calc(100vh - 90px)"
                          class="f-full"
                          :border="false"
                          :striped="true"
                          :columnResizing="true"
                          :data="list" @selectionChange="selectObj($event)"
                          idField="id" treeField="name">
                    <GridColumnGroup :frozen="true" width="400">
                        <GridHeaderRow>
                            <GridColumn field="name" title="名称" width="150"></GridColumn>
                            <GridColumn field="number" title="编号" align="center" width="130"></GridColumn>
                            <GridColumn field="typename" title="类别" align="center" width="120"></GridColumn>
                        </GridHeaderRow>
                    </GridColumnGroup>
                    <GridColumnGroup>
                        <GridHeaderRow>
                            <GridColumn field="unit" title="单位" align="center" width="60"></GridColumn>
                            <GridColumn field="norm" title="规格" align="center" width="120"></GridColumn>
                            <GridColumn field="model" title="型号" align="center" width="120"></GridColumn>
                            <GridColumn field="sourcename" title="来源" align="center" width="120"></GridColumn>
                            <GridColumn field="suppliername" title="供应商" align="center" width="120"></GridColumn>
                            <GridColumn field="commoditycount" title="数量" align="center" width="120"></GridColumn>
                            <GridColumn field="purchaseprice" title="采购单价" align="right" width="150">
                                <template slot="body" slot-scope="scope">
                                    <div class="item">
                                        {{ toMoney(scope.row.purchaseprice, '￥') }}
                                    </div>
                                </template>
                            </GridColumn>
                            <GridColumn field="saleprice" title="销售单价" align="right" width="150">
                                <template slot="body" slot-scope="scope">
                                    <div class="item">
                                        {{ toMoney(scope.row.saleprice, '￥') }}
                                    </div>
                                </template>
                            </GridColumn>
                            <GridColumn field="remark" title="备注"></GridColumn>
                        </GridHeaderRow>
                    </GridColumnGroup>
                </TreeGrid>
            </LayoutPanel>
        </Layout>

        <selectCommodity ref="selectCommodityCom" :single="true" @selectCommodity="selectCommodity"></selectCommodity>
        <selectCommodity ref="selectAccessoriesCom" :single="false" @selectCommodity="getAccessories"></selectCommodity>

        <selectCommodity ref="selectChildCommodity" @selectCommodity="selectChildCommodity"></selectCommodity>
        <Dialog ref="dlgEdit" bodyCls="f-column" title="编辑" :modal="true" closed :dialogStyle="{height:'80vh',width:'80%'}">
            <div class="f-full" style="overflow:auto">
                <Layout bodyCls="f-column">
                    <LayoutPanel region="north" style="height:40px;">
                        <Panel :bodyStyle="{padding:'5px',border:0}">
                            <LinkButton iconCls="icon-add" :plain="true" @click="selectChildCommodityOpen">选择子商品</LinkButton>
                            <LinkButton v-if="selectRow" iconCls="icon-remove" :plain="true" @click="removeChild()">移除</LinkButton>
                        </Panel>
                    </LayoutPanel>
                    <LayoutPanel region="west" style="width:120px;">
                        <Tree :data="tree" @selectionChange="selectionTree($event)"></Tree>
                    </LayoutPanel>
                    <LayoutPanel region="center">
                        <DataGrid :columnResizing="true"
                                  class="f-full"
                                  :data="children" @editEnd="editEnd($event)"
                                  :selectionMode="'single'"
                                  @selectionChange="selectCurrRow($event)"
                                  :clickToEdit="true" editMode="cell"
                                  :striped="true" :border="false"
                                  idField="id">
                            <GridColumn field="number" title="商品编号" align="center"></GridColumn>
                            <GridColumn field="name" title="商品名称" align="center"></GridColumn>
                            <GridColumn field="norm" title="商品规格" align="center"></GridColumn>
                            <GridColumn field="model" title="商品型号" align="center"></GridColumn>
                            <GridColumn field="commoditycount" title="配件数量" :editable="true" align="center"></GridColumn>
                            <GridColumn field="unit" title="计量单位" width="80" align="center"></GridColumn>
                        </DataGrid>
                    </LayoutPanel>
                </Layout>
            </div>
        </Dialog>
        <Dialog ref="editWorksequenceDlg" closed
                :title="'编辑工序'"
                :dialogStyle="{width:'80vw',height:'80vh'}"
                bodyCls="f-column"
                :modal="true">
            <div class="f-full">
                <Layout bodyCls="f-column" style="height:calc(80vh - 40px)">
                    <LayoutPanel region="east" style="width:50%;">
                        <LinkButton iconCls="icon-ok" :plain="true" @click="selectAccessories">选择配件</LinkButton>
                        <!--                        <LinkButton iconCls="icon-remove" :plain="true" :disabled="!accessories.id" @click="deleteAccessories">删除配件</LinkButton>-->
                        <DataGrid :data="accessoriesList" class="f-full" style="height:calc(80vh - 72px)"
                                  @editEnd="editEndAccessories($event)"
                                  :clickToEdit="true" editMode="cell">
                            <GridColumn field="number" title="编号" align="center"></GridColumn>
                            <GridColumn field="name" title="名称" align="center"></GridColumn>
                            <GridColumn field="norm" title="规格" align="center"></GridColumn>
                            <GridColumn field="model" title="型号" align="center"></GridColumn>
                            <GridColumn field="demandcount" title="需求数量" align="center" :editable="true">
                                <template slot="body" slot-scope="scope">
                                    {{ scope.row.demandcount }}
                                </template>
                                <template slot="edit" slot-scope="scope">
                                    <input type="number" v-model="scope.row.demandcount" onclick="select()" class="form-control">
                                </template>
                            </GridColumn>
                            <GridColumn field="losscount" title="损耗数量" align="center" :editable="true">
                                <template slot="body" slot-scope="scope">
                                    {{ scope.row.losscount }}
                                </template>
                                <template slot="edit" slot-scope="scope">
                                    <input type="number" v-model="scope.row.losscount" onclick="select()" class="form-control">
                                </template>
                            </GridColumn>
                            <GridColumn title="移除" align="center" width="40">
                                <template slot="body" slot-scope="scope">
                                    <a class="c-red" @click="deleteAccessories(scope.row)">移除</a>
                                </template>
                            </GridColumn>
                        </DataGrid>
                    </LayoutPanel>
                    <LayoutPanel region="center" style="height:100%">
                        <LinkButton iconCls="icon-add" :plain="true" @click="newWorksequence">新建工序</LinkButton>
                        <LinkButton iconCls="icon-ok" :plain="true" @click="selWorksequence">选择工序</LinkButton>
                        <LinkButton iconCls="icon-remove" :plain="true" :disabled="!worksequenceObj.id" @click="deleteWorksequence">删除工序</LinkButton>
                        <DataGrid :data="productworksequences" class="f-full" style="height:calc(80vh - 72px)"
                                  @selectionChange="selectProductworksequence($event)"
                                  selectionMode="single">
                            <GridColumn field="number" title="工序编号" align="center"></GridColumn>
                            <GridColumn field="name" title="工序名称" align="center"></GridColumn>
                            <GridColumn field="price" title="工序单价" align="center"></GridColumn>
                            <GridColumn field="productiontime" title="生产时间(分钟)" align="center"></GridColumn>
                            <GridColumn field="content" title="内容" align="center"></GridColumn>
                        </DataGrid>
                    </LayoutPanel>
                </Layout>
            </div>
        </Dialog>
        <selectWorksequence ref="selectWorksequenceCom" @selectWorksequence="selectWorksequence"></selectWorksequence>
        <editWorksequence ref="editWorksequenceCom" @worksequenceSave="worksequenceSave"></editWorksequence>
    </div>
</template>

<script>
import selectCommodity from '@/components/selectCommodity.vue'
import selectWorksequence from '@/components/selectWorksequence.vue'
import editWorksequence from '@/components/editWorksequence.vue'
import filterList from '@/components/filterList.vue'

export default {
    data() {
        return {
            list: [],
            tree: [],
            children: [],
            selectCommodityObj: null,
            selectRow: null,
            node: {},
            productworksequences: [],
            productworksequenceschilds: [],
            worksequenceObj: {},
            accessoriesList: [],
            accessories: {},
            timeout: null
        };
    },
    created() {
        this.load();
    },
    components: {
        selectCommodity, selectWorksequence, editWorksequence, filterList
    },
    methods: {
        load(fs) {
            let vm = this;
            this.getData("productstructure/getTreeList", {id: 0}, function (data) {
                vm.list = [];
                data.forEach(function (e) {
                    if(fs){
                        if(e.name.indexOf(fs) >= 0 || e.number.indexOf(fs) >= 0 ) {
                            vm.list.push(e);
                        }
                    }else{
                        vm.list.push(e);
                    }
                })
            });
        },
        add() {
            this.$refs.selectCommodityCom.load();
            this.children = [];
        },
        selectCommodity(obj) {
            let newObj = {
                pid: 0,
                commodityid: obj.id
            }
            let vm = this;
            this.getData("productstructure/saveNew", newObj, function (data) {
                vm.$refs.dlgEdit.open();
                vm.load();
                vm.loadTree(data.id);
            })
        },
        loadTree(id) {
            let vm = this;
            this.getData("productstructure/getTree", {id: id}, function (data) {
                vm.tree = data;
                console.log(JSON.stringify(data));
            })
        },
        loadChildren(pid) {
            let vm = this;
            this.getData("productstructure/getListByPid", {pid: pid}, function (data) {
                vm.children = data;
            })
        },
        selectionTree(obj) {
            this.node = obj;
            this.selectRow = null;
            this.loadChildren(this.node.id);
        },
        selectChildCommodityOpen() {
            this.$refs.selectChildCommodity.load();
        },
        selectChildCommodity(obj) {
            obj.commodityid = obj.id;
            obj.pid = this.node.id;
            obj.id = 0;
            obj.commoditycount = 1;
            let vm = this;
            this.getData("productstructure/save", obj, function (data) {
                vm.loadChildren(vm.node.id);
                vm.loadTree(vm.selectCommodityObj.id);
                vm.load();
            })
        },
        selectObj(obj) {
            this.selectCommodityObj = obj;
        },
        edit() {
            if (this.selectCommodityObj.pid > 0) {
                this.alert('请选择顶级产品');
            } else {
                this.$refs.dlgEdit.open();
                this.loadTree(this.selectCommodityObj.id);
            }
        },
        selectCurrRow(obj) {
            this.selectRow = obj;
        },
        editEnd(obj) {
            if (isNaN(obj.row.commoditycount)) {
                this.alert('格式错误', function () {
                    obj.row.commoditycount = 1;
                });
            } else {
                let vm = this;
                this.getData("productstructure/save", obj.row, function (data) {
                    vm.loadChildren(vm.node.id);
                })
            }
        },
        removeChild() {
            if (this.selectRow) {
                let vm = this;
                this.confirm('确认吗?', function () {
                    vm.getData("productstructure/delete", {id: vm.selectRow.id}, function (data) {
                        vm.selectRow = null;
                        vm.loadChildren(vm.node.id);
                        vm.loadTree(vm.selectCommodityObj.id);
                    })
                })
            } else {
                this.alert('请选择一行');
            }
        },
        worksequenceSet() {
            this.$refs.editWorksequenceDlg.open();
            this.loadWorksequence();
        },
        loadWorksequence() {
            let vm = this;
            this.getData("productworksequence/getMaps", {productid: this.selectCommodityObj.id}, function (data) {
                vm.productworksequences = data;
            })
        },
        selectProductworksequence(obj) {
            this.worksequenceObj = obj;
            this.loadAccessories();
        },
        newWorksequence() {
            this.$refs.editWorksequenceCom.open();
        },
        worksequenceSave(obj) {
            this.selectWorksequence(obj);
        },
        selWorksequence() {
            this.$refs.selectWorksequenceCom.openDlg();
        },
        selectWorksequence(obj) {
            let workObj = {
                productid: this.selectCommodityObj.id,
                worksequenceid: obj.id
            }
            let vm = this;
            this.getData("productworksequence/save", workObj, function (data) {
                vm.loadWorksequence();
            })
        },
        deleteWorksequence() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("productworksequence/delete", {id: vm.worksequenceObj.id}, function (data) {
                    vm.loadWorksequence();
                    vm.accessoriesList = [];
                })
            })
        },
        //选择配件
        selectAccessories() {
            this.$refs.selectAccessoriesCom.load();
        },
        loadAccessories() {
            let vm = this;
            this.accessoriesList = [];
            this.getData("productworksequencechild/getMaps", {pid: this.worksequenceObj.id}, function (data) {
                vm.accessoriesList = data;
            })
        },
        getAccessories(obj) {
            let object = {
                pid: this.worksequenceObj.id,
                commodityid: obj.id,
                demandcount: 1,
                losscount: 0
            }
            let vm = this;
            this.getData("productworksequencechild/save", object, function (data) {
                vm.loadAccessories();
            })
        },
        editEndAccessories(obj) {
            console.log(obj);
            let vm = this;
            this.getData("productworksequencechild/save", obj.row, function (data) {
                // vm.loadAccessories();
            })
        },
        deleteAccessories(obj) {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("productworksequencechild/delete", {id: obj.id}, function (data) {
                    vm.loadAccessories();
                })
            })
        }
    }
};
</script>
