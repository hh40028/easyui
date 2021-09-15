<template>
    <div>
        <Layout bodyCls="f-column" :border="false">
            <LayoutPanel region="north" :border="false">
                <table class="w-100" border="1">
                    <tbody>
                    <tr>
                        <td class="text-right">供应商家</td>
                        <td class="text-left">{{obj.suppliername}}</td>
                        <td class="text-right">经办人员</td>
                        <td class="text-left">{{obj.username}}</td>
                    </tr>
                    <tr>
                        <td class="text-right">采购日期</td>
                        <td class="text-left">{{obj.purchasedate}}</td>
                        <td class="text-right">合计金额</td>
                        <td class="text-left">{{obj.amount|number2}} 元</td>
                    </tr>
                    <tr>
                        <td class="text-right">摘要说明</td>
                        <td class="text-left" colspan="3">{{obj.remark}}</td>
                    </tr>
                    </tbody>
                </table>
            </LayoutPanel>
            <LayoutPanel region="center" style="height:100%" :border="false">
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
                    <GridColumn field="commoditycount" title="商品数量" align="center">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                {{scope.row.commoditycount|number2}} {{scope.row.unit}}
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
