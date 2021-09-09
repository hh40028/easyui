<template>
    <div>
        <Layout bodyCls="f-column" :border="false">
            <LayoutPanel region="north" style="height:190px;" :border="false">
                <table border="1" class="w-100">
                    <tbody>
                    <tr>
                        <td class="text-right">合同单号</td>
                        <td class="text-left">{{ obj.contractno }}</td>
                        <td class="text-right">合同名称</td>
                        <td class="text-left">{{ obj.contractname }}</td>
                        <td class="text-right">合同类型</td>
                        <td class="text-left">{{ obj.typename }}</td>
                    </tr>
                    <tr>
                        <td class="text-right">业务部门</td>
                        <td class="text-left">{{ obj.depname }}</td>
                        <td class="text-right">业务人员</td>
                        <td class="text-left">{{ obj.username }}</td>
                        <td class="text-right">客户名称</td>
                        <td class="text-left">{{ obj.customername }}</td>
                    </tr>
                    <tr>
                        <td class="text-right">客户代表</td>
                        <td class="text-left">{{ obj.customeruser }}</td>
                        <td class="text-right">签订日期</td>
                        <td class="text-left">{{ obj.signdate }}</td>
                        <td class="text-right">生效日期</td>
                        <td class="text-left">{{ obj.effectivedate }}</td>
                    </tr>
                    <tr>
                        <td class="text-right">开始日期</td>
                        <td class="text-left">{{ obj.startdate }}</td>
                        <td class="text-right">结束日期</td>
                        <td class="text-left">{{ obj.enddate }}</td>
                        <td class="text-right">合同金额</td>
                        <td class="text-left">{{ obj.amount|number2 }} 元</td>
                    </tr>
                    <tr>
                        <td class="text-right">摘要说明</td>
                        <td class="text-left" colspan="5">{{ obj.remark }}</td>
                    </tr>
                    </tbody>
                </table>
            </LayoutPanel>
            <LayoutPanel region="center" style="height:100%" :border="false">
                <DataGrid :columnResizing="true"
                          :bodyStyle="{padding:'5px',border:0}"
                          class="f-full"
                          :border="false"
                          :data="obj.children"
                          idField="id">

                    <GridColumn title="序号" width="50" align="center">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                <div>{{ scope.rowIndex + 1 }}</div>
                            </div>
                        </template>
                    </GridColumn>
                    <GridColumn field="number" title="商品编号" align="center"></GridColumn>
                    <GridColumn field="name" title="商品名称" align="center"></GridColumn>
                    <GridColumn field="norm" title="商品规格" align="center"></GridColumn>
                    <GridColumn field="model" title="商品型号" align="center"></GridColumn>
                    <GridColumn field="unit" title="商品单位" align="center"></GridColumn>
                    <GridColumn field="unit" title="合同数量" align="center">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                {{ scope.row.count|number2 }}
                            </div>
                        </template>
                    </GridColumn>
                    <GridColumn field="unit" title="合同单价" align="center">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                {{ scope.row.price|number2 }}
                            </div>
                        </template>
                    </GridColumn>
                    <GridColumn field="amount" title="金额" align="center">
                        <template slot="body" slot-scope="scope">
                            <div class="item">{{ scope.row.count * scope.row.price |number2 }}
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
            this.getData("contract/getMap", {id: this.id}, function (data) {
                vm.obj = data;
            })
        }
    }
}
</script>

<style scoped>

</style>
