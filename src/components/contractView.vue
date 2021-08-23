<template>
    <div>
        <Layout bodyCls="f-column" :border="false">
            <LayoutPanel region="north" style="height:190px;" :border="false">
                <div class="col-4 p-5 f-16">合同单号: {{obj.contractno}}</div>
                <div class="col-4 p-5 f-16">合同名称: {{obj.contractname}}</div>
                <div class="col-4 p-5 f-16">合同类型: {{obj.typename}} </div>
                <div class="col-4 p-5 f-16">业务部门: {{obj.depname}}</div>
                <div class="col-4 p-5 f-16">业务人员: {{obj.username}}</div>
                <div class="col-4 p-5 f-16">客户名称: {{obj.customername}}</div>
                <div class="col-4 p-5 f-16">客户代表: {{obj.customeruser}}</div>
                <div class="col-4 p-5 f-16">签订日期: {{obj.signdate}}</div>
                <div class="col-4 p-5 f-16">生效日期: {{obj.effectivedate}}</div>
                <div class="col-4 p-5 f-16">开始日期: {{obj.startdate}}</div>
                <div class="col-4 p-5 f-16">结束日期: {{obj.enddate}}</div>
                <div class="col-4 p-5 f-16">合同金额: {{obj.amount|number2}} 元</div>
                <div class="col-12 p-5 f-16">摘要说明: {{obj.remark}} </div>
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
                                {{scope.row.count|number2}}
                            </div>
                        </template>
                    </GridColumn>
                    <GridColumn field="unit" title="合同单价" align="center">
                        <template slot="body" slot-scope="scope">
                            <div class="item">
                                {{scope.row.price|number2}}
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
    props:['id'],
    name: "app",
    data() {
        return {
            obj:{
                children:[]
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
