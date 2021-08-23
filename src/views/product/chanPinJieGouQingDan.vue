<template>
    <div>
        <Layout bodyCls="f-column" style="height:calc(100vh - 50px);" :border="false">
            <LayoutPanel region="north" style="height:50px;">
                <div class="col-3 p-5">
                    <LinkButton iconCls="icon-add" :plain="true" @click="add">新增</LinkButton>
                    <LinkButton iconCls="icon-edit" :disabled="!selectCommodityObj" :plain="true" @click="edit">编辑</LinkButton>
                    <LinkButton iconCls="icon-reload" :plain="true" @click="load">刷新</LinkButton>
                </div>
                <div class="col-3 p-5"></div>
                <div class="col-3 p-5"></div>
                <div class="col-3 p-5">
                    <SearchBox class="form-control"
                               placeholder="过滤..."
                               v-model="filterString"
                               @search="load($event)">
                        <Addon>
                            <span v-if="filterString" class="textbox-icon icon-clear" title="Clear value" @click="filterString=null"></span>
                        </Addon>
                    </SearchBox>
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
                    <GridColumnGroup :frozen="true">
                        <GridHeaderRow>
                            <GridColumn field="name" title="名称" width="150"></GridColumn>
                        </GridHeaderRow>
                    </GridColumnGroup>
                    <GridColumnGroup>
                        <GridHeaderRow>
                            <GridColumn field="number" title="编号" align="center" width="130"></GridColumn>
                            <GridColumn field="unit" title="单位" align="center" width="120"></GridColumn>
                            <GridColumn field="commoditycount" title="数量" align="center" width="120"></GridColumn>
                            <GridColumn field="purchaseprice" title="采购单价" align="right" width="150"></GridColumn>
                            <GridColumn field="saleprice" title="销售单价" align="right" width="150"></GridColumn>
                            <GridColumn field="remark" title="备注"></GridColumn>
                        </GridHeaderRow>
                    </GridColumnGroup>
                </TreeGrid>
            </LayoutPanel>
        </Layout>


        <Dialog ref="dlg" bodyCls="f-column" title="选择商品" :modal="true" closed :dialogStyle="{height:'60vh',width:'60%'}">
            <div class="f-full" style="overflow:auto">
                <selectCommodity ref="selectCommodity" @selectCommodity="selectCommodity"></selectCommodity>
            </div>
        </Dialog>

        <Dialog ref="dlgSelectChildCommodity" bodyCls="f-column" title="选择商品" :modal="true" closed :dialogStyle="{height:'60vh',width:'60%'}">
            <div class="f-full" style="overflow:auto">
                <selectCommodity ref="selectChildCommodity" @selectCommodity="selectChildCommodity"></selectCommodity>
            </div>
        </Dialog>

        <Dialog ref="dlgEdit" bodyCls="f-column" title="编辑" :modal="true" closed :dialogStyle="{height:'60vh',width:'60%'}">
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
                                  @selectionChange="selectCurrRow($event)"
                                  :clickToEdit="true" editMode="cell"
                                  :striped="true" :border="false"
                                  idField="id"
                                  :selectionMode="'single'">
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
    </div>
</template>

<script>
import selectCommodity from '../../components/selectCommodity.vue'

export default {
    data() {
        return {
            screenHeight: window.innerHeight,
            list: [],
            filterString: '',
            tree: [],
            children: [],
            selectCommodityObj: null,
            selectRow: null,
            node: {}
        };
    },
    created() {
    },
    components: {
        selectCommodity
    },
    mounted() {
        this.load();
        const that = this;
        window.onresize = () => {
            return (() => {
                that.screenHeight = window.innerHeight
            })()
        }
    },
    methods: {
        load() {
            let vm = this;
            this.getData("productstructure/getTreeList", {id: 0}, function (data) {
                vm.list = [];
                data.forEach(function (e) {
                    if (!isNaN(e.purchaseprice)) {
                        e.purchaseprice = e.purchaseprice.toFixed(2);
                    }
                    if (!isNaN(e.saleprice)) {
                        e.saleprice = e.saleprice.toFixed(2);
                    }
                    vm.list.push(e);
                })
                console.log(data);
            });
        },
        add() {
            this.$refs.dlg.open();
        },
        selectCommodity(obj) {
            this.$refs.dlg.close();
            let newObj = {
                pid: 0,
                commodityid: obj.id
            }
            let vm = this;
            this.getData("productstructure/saveNew", newObj, function (data) {
                vm.$refs.dlgEdit.open();
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
            this.$refs.dlgSelectChildCommodity.open();
        },
        selectChildCommodity(obj) {
            this.$refs.dlgSelectChildCommodity.close();
            obj.commodityid = obj.id;
            obj.pid = this.node.id;
            obj.id = 0;
            obj.commoditycount = 1;
            let vm = this;
            this.getData("productstructure/save", obj, function (data) {
                vm.loadChildren(vm.node.id);
                vm.loadTree(vm.selectCommodityObj.id);
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
        }
    }
};
</script>
