<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" style="height:130px;">
            <table border="1" class="w-100">
                <tbody>
                <tr>
                    <td class="text-right">订单编号</td>
                    <td class="text-left">{{ obj.number }}</td>
                    <td class="text-right">订货客户</td>
                    <td class="text-left">{{ obj.customername }}</td>
                    <td class="text-right">订货日期</td>
                    <td class="text-left">{{ obj.saleorderdate }}</td>
                </tr>
                <tr>
                    <td class="text-right">交货日期</td>
                    <td class="text-left">{{ obj.enddate }}</td>
                    <td class="text-right">订货金额</td>
                    <td class="text-left">{{ obj.total|number2 }} 元</td>
                    <td class="text-right">合同编号</td>
                    <td class="text-left">{{ obj.contractno }}</td>
                </tr>
                <tr>
                    <td class="text-right">摘要说明</td>
                    <td class="text-left" colspan="5">{{ obj.remark }}</td>
                </tr>
                </tbody>
            </table>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column" :border="false">
            <DataGrid
                :border="false"
                class="f-full"
                :columnResizing="true"
                :lazy="true"
                :data="obj.children"
                selectionMode="single">
                <GridColumnGroup :frozen="true" align="left" width="280">
                    <GridHeaderRow>
                        <GridColumn title="序号" width="40" align="center" :frozen="true">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{ scope.rowIndex + 1 }}
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="number" title="商品编号" width="120" align="center"></GridColumn>
                        <GridColumn field="name" title="商品名称" width="120" align="center"></GridColumn>
                    </GridHeaderRow>
                </GridColumnGroup>
                <GridColumnGroup>
                    <GridHeaderRow>
                        <GridColumn field="norm" title="规格" width="120" align="center"></GridColumn>
                        <GridColumn field="model" title="型号" width="120" align="center"></GridColumn>
                        <GridColumn field="stockcount" title="库存数量" width="120" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item" :class="{'c-teal':scope.row.stockcount>=scope.row.salecount,
                                'c-red':scope.row.stockcount<scope.row.salecount}">
                                    {{scope.row.stockcount}} ({{ scope.row.unit }})
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="salecount" title="订货数量" width="120" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{scope.row.salecount}} ({{ scope.row.bigpackage ? scope.row.bigunit : scope.row.unit }})
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="saleprice" title="订货金额" width="120" align="center"></GridColumn>
                        <GridColumn field="username" title="金额" width="100" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{ scope.row.salecount * scope.row.saleprice|number2 }}
                                </div>
                            </template>
                        </GridColumn>
                    </GridHeaderRow>
                </GridColumnGroup>
            </DataGrid>
        </LayoutPanel>
    </Layout>
</template>

<script>
export default {
    props: ['id'],
    name: "app",
    data() {
        return {
            obj: {
                children: []
            }
        }
    },
    created: function () {
        this.load();
    },
    methods: {
        load: function () {
            let vm = this;
            this.getData("saleorder/getMap", {id: this.id}, function (data) {
                vm.obj = data;
            })
        }
    }
}
</script>

<style scoped>

</style>
