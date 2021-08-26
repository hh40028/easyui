<template>
    <Layout bodyCls="f-column">
        <LayoutPanel region="north" style="height:50px;">
            <Panel :bodyStyle="{padding:'5px'}" :border="false">
                <div class="col-4 p-10">
                    仓库名称: {{obj.warehousename}}
                </div>
                <div class="col-4 p-10">
                    入库日期: {{obj.entrydate}}
                </div>
                <div class="col-4 p-10">
                    摘要说明: {{obj.remark}}
                </div>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%">
            <DataGrid :columnResizing="true" class="f-full"
                      :bodyStyle="{padding:'5px',border:0}"
                      :border="false"
                      :data="obj.children"
                      idField="id">
                <GridColumn title="序号" align="center" width="50">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{scope.rowIndex+1}}
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
                            {{scope.row.bigpackage?scope.row.bigunit:scope.row.unit}}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="commoditycount" title="入库数量" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">{{scope.row.incount|number2}}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="commodityprice" title="入库单价" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">{{scope.row.inprice|number2}}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="cargolocationnumber" title="货位" align="center"></GridColumn>
            </DataGrid>
        </LayoutPanel>
    </Layout>
</template>

<script>
export default {
    props:{
        id:Number
    },
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
            this.getData("directstorage/getMap", {id:this.id}, function (data) {
                vm.obj=data;
            })
        }
    }
}
</script>

<style scoped>

</style>
