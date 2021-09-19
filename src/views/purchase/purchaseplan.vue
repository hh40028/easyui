<template>
    <Layout :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'5px'}" :border="false">
                <LinkButton iconCls="icon-add" :plain="true" @click="buildPurchaseOrder">生成采购订单</LinkButton>
                <LinkButton iconCls="icon-remove" :plain="true" @click="remove">删除</LinkButton>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" :border="false">
            <DataGrid
                :border="false"
                class="f-full"
                selectionMode="multiple"
                @selectionChange="selection=$event"
                :columnResizing="true"
                :data="data">
                <GridColumn field="productionplannumber" title="生产计划编号" align="center"></GridColumn>
                <GridColumn field="number" title="商品编号" align="center"></GridColumn>
                <GridColumn field="name" title="商品名称" align="center"></GridColumn>
                <GridColumn field="norm" title="商品规格" align="center"></GridColumn>
                <GridColumn field="model" title="商品型号" align="center"></GridColumn>
                <GridColumn field="count" title="采购数量" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.row.count }}{{ ' ' + scope.row.unit }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="stockcount" title="库存数量" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.row.stockcount }}{{ ' ' + scope.row.unit }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="endtime" title="截止日期" align="center"></GridColumn>
                <GridColumn field="suppliername" title="供应商" align="center" :sortable="true"></GridColumn>
            </DataGrid>
            <Dialog ref="editPurchaseOrderDlg" closed
                    :title="'编辑采购订单'"
                    :dialogStyle="{width:'80vw',height:'80vh'}"
                    :draggable="true"
                    :resizable="true"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <Layout bodyCls="f-column" :border="false">
                        <LayoutPanel region="north" :border="false">
                            <div class="col-3 p-10">
                                <label>供应商</label>
                                <selectSupplier input="true" :suppliername="purchaseOrder.suppliername" @selectSupplier="selectSupplier"></selectSupplier>
                            </div>
                            <div class="col-3 p-10">
                                <label>到货日期</label>
                                <input type="date" class="form-control" v-model="purchaseOrder.endtime">
                            </div>
                            <div class="col-3 p-10">
                                <label>预付订金</label>
                                <input type="number" class="form-control" v-model="purchaseOrder.deposit">
                            </div>
                            <div class="col-3 p-10">
                                <label>摘要说明</label>
                                <input type="text" class="form-control" v-model="purchaseOrder.remark">
                            </div>
                        </LayoutPanel>
                        <LayoutPanel region="center" style="height:100%" :border="false">
                            <DataGrid
                                :border="false"
                                class="f-full" :clickToEdit="true" editMode="cell"
                                :columnResizing="true"
                                :data="purchaseOrder.list">
                                <GridColumn field="number" title="商品编号" align="center"></GridColumn>
                                <GridColumn field="name" title="商品名称" align="center"></GridColumn>
                                <GridColumn field="norm" title="商品规格" align="center"></GridColumn>
                                <GridColumn field="model" title="商品型号" align="center"></GridColumn>
                                <GridColumn field="unit" title="商品单位" align="center"></GridColumn>
                                <GridColumn field="stockcount" title="库存数量" align="center">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <span :class="{'c-teal':scope.row.stockcount>scope.row.count}">{{ scope.row.stockcount }} {{ ' ' + scope.row.unit }}</span>

                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="count" title="采购数量" align="center" :editable="true">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            {{ scope.row.count }} {{ ' ' + scope.row.unit }}
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn field="price" title="采购单价" align="right" :editable="true">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            {{ toMoney(scope.row.price, '￥') }}
                                        </div>
                                    </template>
                                </GridColumn>
                                <GridColumn title="移除" align="center" width="40">
                                    <template slot="body" slot-scope="scope">
                                        <div class="item">
                                            <div class="c-red" @click="removeIndex(scope.rowIndex)">移除</div>
                                        </div>
                                    </template>
                                </GridColumn>
                            </DataGrid>
                        </LayoutPanel>
                    </Layout>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="submit">提交</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editPurchaseOrderDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectSupplier from '@/components/selectSupplier.vue';

export default {
    name: "app",
    data() {
        return {
            data: [],
            process: false,
            selection: [],
            purchaseOrder: {
                list: []
            }
        }
    },
    created: function () {
        this.load();
    },
    components: {
        selectSupplier
    },
    computed: {
        selectionInfo() {
            return this.selection.map(function (row) {
                return row.id
            }).join(",");
        }
    },
    methods: {
        load: function () {
            let vm = this;
            this.getData("purchaseplan/getMaps", {process: this.process}, function (data) {
                vm.data = data;
            })
        },
        buildPurchaseOrder() {
            let vm = this;
            if (!this.selection.length) {
                this.alert('没有选择任何记录');
            } else {
                this.purchaseOrder = {
                    supplierid: 0,
                    purchasedate: '',
                    remark: '',
                    deposit: 0,
                    endtime: '2222-01-01',
                    list: []
                };
                this.selection.forEach(function (e) {
                    let flag = false;
                    vm.purchaseOrder.list.forEach(function (a) {
                        if (a.commodityid === e.commodityid) {
                            flag = true;
                        }
                    })
                    if (!flag) {
                        vm.purchaseOrder.list.push({
                            commodityid: e.commodityid,
                            number: e.number,
                            name: e.name,
                            norm: e.norm,
                            model: e.model,
                            unit: e.unit,
                            count: 0,
                            price: 0,
                            planids: ''
                        })
                    }
                })

                this.purchaseOrder.list.forEach(function (a) {
                    vm.selection.forEach(function (e) {
                        if (a.commodityid === e.commodityid) {
                            a.count += e.count;
                            if (e.endtime < vm.purchaseOrder.endtime) {
                                vm.purchaseOrder.endtime = e.endtime;
                            }
                            a.planids += e.id + ",";
                        }
                    });
                })
                this.getData("purchaseplan/buildPurchaseOrder", {
                    rows: JSON.stringify(vm.purchaseOrder.list)
                }, function (data) {
                    vm.purchaseOrder.list = data;
                    vm.$refs.editPurchaseOrderDlg.open();
                })
            }
        },
        removeIndex(index) {
            this.purchaseOrder.list.splice(index, 1);
        },
        selectSupplier(obj) {
            this.$set(this.purchaseOrder, 'supplierid', obj.id);
            this.$set(this.purchaseOrder, 'suppliername', obj.name);
        },
        submit() {
            let vm = this;
            let err = '';
            if (!this.purchaseOrder.supplierid) {
                err += '请选择供应商<br>';
            }
            if (!this.purchaseOrder.endtime) {
                err += '请选择到货日期<br>';
            }
            if (!this.purchaseOrder.list.length) {
                err += '没有任何商品<br>';
            }
            if (err.length > 0) {
                this.alert(err);
            } else {
                this.confirm('确认吗?', function () {
                    vm.getData("purchaseorder/submit", {
                        obj: JSON.stringify(vm.purchaseOrder),
                        selection: JSON.stringify(vm.selection)
                    }, function (data) {
                        vm.$refs.editPurchaseOrderDlg.close();
                        vm.load();
                    })
                })
            }
        },
        remove() {
            let vm = this;
            this.confirm('删除所选采购计划，确认吗?', function () {
                vm.getData("purchaseplan/delete", {
                    selection: JSON.stringify(vm.selection)
                }, function (data) {
                    vm.load();
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
