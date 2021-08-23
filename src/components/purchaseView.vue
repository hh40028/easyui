<template>
    <div>
        <Layout bodyCls="f-column" :border="false">
            <LayoutPanel region="north" style="height:70px;" :border="false">
                <div class="col-3 p-5 f-16">供应商家: {{obj.suppliername}}</div>
                <div class="col-3 p-5 f-16">经办人员: {{obj.username}}</div>
                <div class="col-3 p-5 f-16">采购日期: {{obj.purchasedate}} </div>
                <div class="col-3 p-5 f-16">合计金额: {{obj.amount|number2}} 元</div>
                <div class="col-12 p-5 f-16">摘要说明: {{obj.remark}} </div>
            </LayoutPanel>
            <LayoutPanel region="center" style="height:100%" :border="true">
                <DataGrid :columnResizing="true" class="f-full"
                          :bodyStyle="{padding:'5px',border:0}"
                          :border="false"
                          :data="list"
                          idField="id">

                    <GridColumn field="warehousename" title="入货仓库" align="center" width="150"></GridColumn>
                    <GridColumn field="number" title="商品编号" align="center"></GridColumn>
                    <GridColumn field="name" title="商品名称" align="center"></GridColumn>
                    <GridColumn field="norm" title="商品规格" align="center"></GridColumn>
                    <GridColumn field="model" title="商品型号" align="center"></GridColumn>
                    <GridColumn field="bigpackage" title="商品单位" align="center">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                {{scope.row.bigpackage?scope.row.unit:scope.row.bigunit}}
                            </div>
                        </template>
                    </GridColumn>
                    <GridColumn field="commoditycount" title="商品数量" align="center">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                {{scope.row.commoditycount|number2}}
                            </div>
                        </template>
                    </GridColumn>
                    <GridColumn field="commodityprice" title="商品单价" align="center">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                {{scope.row.commodityprice|number2}}
                            </div>
                        </template>
                    </GridColumn>
                    <GridColumn field="unit" title="商品单位" align="center"></GridColumn>
                    <GridColumn field="amount" title="金额" align="center">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                {{scope.row.commoditycount*scope.row.commodityprice|number2}}
                            </div>
                        </template>
                    </GridColumn>
                </DataGrid>
            </LayoutPanel>
        </Layout>
    </div>
</template>

<script>
export default {
    props:['id'],
    name: "app",
    data() {
        return {
            obj:{},
            list:[]
        }
    },
    created: function () {
        this.load();
    },
    methods: {
        load: function () {
            let vm = this;
            this.getData("purchase/getMap", {id: this.id}, function (data) {
                vm.obj = data.obj;
                vm.list=data.list;
            })
        },
    }
}
</script>

<style scoped>

</style>
