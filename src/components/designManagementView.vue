<template>
    <Layout bodyCls="f-column" style="height:100%;">

        <LayoutPanel region="east" style="width:60%;">
            <DataGrid
                :border="false"
                class="f-full"
                :data="documents"
                :columnResizing="true">
                <GridColumn title="序号" width="50" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.rowIndex + 1 }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="sourcename" title="附件名称"></GridColumn>
                <GridColumn field="publishtime" title="发布时间" width="200" align="center"></GridColumn>
            </DataGrid>

        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" class="p-10" :border="false">
            <div class="col-12 p-10">
                设计状态:
                <span v-if="obj.status===0">开始设计</span>
                <span v-if="obj.status===1">完成设计</span>
            </div>
            <div class="col-12 p-10">
                设计编码: {{ obj.number }}
            </div>
            <div class="col-12 p-10">
                产品编号: {{ obj.commoditynumber }}
            </div>
            <div class="col-12 p-10">
                产品名称: {{ obj.name }}
            </div>
            <div class="col-12 p-10">
                产品规格: {{ obj.norm }}
            </div>
            <div class="col-12 p-10">
                产品型号: {{ obj.model }}
            </div>
            <div class="col-12 p-10">
                设计人员: {{ obj.designer }}
            </div>
            <div class="col-12 p-10">
                开始时间: {{ obj.starttime }}
            </div>
            <div class="col-12 p-10">
                完成时间: {{ obj.completetime }}
            </div>
            <div class="col-12 p-10">
                设计说明: {{ obj.remark }}
            </div>
        </LayoutPanel>
    </Layout>
</template>

<script>
export default {
    props: ['id'],
    name: "app",
    data() {
        return {
            obj: {},
            documents: []
        }
    },
    created: function () {
    },
    mounted: function () {
        let vm = this;
        this.getData("designmanagement/getMap", {id: vm.id}, function (data) {
            vm.obj = data;
            console.log(vm.obj);
        })
        this.getData("attachment/getAllList", {rid: vm.id}, function (data) {
            vm.documents = data;
            console.log(vm.documents);
        })
    },
    methods: {
    }
}
</script>

<style scoped>

</style>
