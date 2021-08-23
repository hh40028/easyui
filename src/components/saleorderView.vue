<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" style="height:130px;">
            <div class="col-4 p-10">订单编号: {{obj.number}}</div>
            <div class="col-4 p-10">订货客户: {{obj.customername}}</div>
            <div class="col-4 p-10">订货日期: {{obj.saleorderdate}}</div>
            <div class="col-4 p-10">交货日期: {{obj.enddate}}</div>
            <div class="col-4 p-10">订货金额: {{obj.total|number2}} 元</div>
            <div class="col-4 p-10">合同编号: {{obj.contractno}}</div>
            <div class="col-12 p-10">摘要说明: {{obj.remark}}</div>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%">
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
                        <GridColumn field="norm" title="规格" width="180" align="center"></GridColumn>
                        <GridColumn field="model" title="型号" width="180" align="center"></GridColumn>
                        <GridColumn field="bigpackage" title="商品单位" width="120" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{scope.row.bigpackage?scope.row.bigunit:scope.row.unit}}
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="salecount" title="订货数量" width="120" align="center"></GridColumn>
                        <GridColumn field="saleprice" title="订货金额" width="120" align="center"></GridColumn>
                        <GridColumn field="username" title="金额" width="100" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{scope.row.salecount*scope.row.saleprice|number2}}
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
            this.getData("saleorder/getMap", {id:this.id}, function (data) {
                vm.obj=data;
                console.log(vm.obj);
            })
        }
    }
}
</script>

<style scoped>

</style>
