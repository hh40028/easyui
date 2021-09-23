<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'5px'}" :border="false">
                <LinkButton iconCls="icon-ok" :disabled="!obj.id" :plain="true" @click="finish">完成</LinkButton>
                <ButtonGroup selectionMode="single" class="m-l-30">
                    <LinkButton :toggle="true" :selected="status===0" @click="changeFinish(0)">未完成</LinkButton>
                    <LinkButton :toggle="true" :selected="status===1" @click="changeFinish(1)">已完成</LinkButton>
                </ButtonGroup>
                <div class="pull-right">
                    <filterList @filterLoad="filter"></filterList>
                </div>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" :border="false" bodyCls="f-column">
            <DataGrid :border="false"
                      class="f-full"
                      :columnResizing="true"
                      :lazy="true"
                      :data="data"
                      :total="total"
                      selectionMode="single"
                      :loading="loading"
                      @selectionChange="selectObj($event)"
                      :pageNumber="pageNumber"
                      :pageSize="pageSize"
                      @pageChange="onPageChange($event)"
                      :pagination="true"
                      :pagePosition="'bottom'">
                <GridColumn title="序号" width="40" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.rowIndex + 1 }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="plannumber" title="加工单号" width="80" align="center"></GridColumn>
                <GridColumn field="deptname" title="加工部门" width="80" align="center"></GridColumn>
                <GridColumn field="operatorname" title="操作人" width="120" align="center"></GridColumn>
                <GridColumn field="worksequencenumber" title="工序编号" width="180" align="center"></GridColumn>
                <GridColumn field="worksequencename" title="工序名称" width="180" align="center"></GridColumn>
                <GridColumn field="starttime" title="开始时间" width="120" align="center"></GridColumn>
                <GridColumn field="finishtime" title="完成时间" width="120" align="center"></GridColumn>
                <GridColumn field="receiptquantity" title="加工数量" width="120" align="center"></GridColumn>
                <GridColumn field="remark" title="备注说明" width="280" align="left"></GridColumn>
            </DataGrid>
        </LayoutPanel>
    </Layout>
</template>

<script>
import filterList from "@/components/filterList";

export default {
    name: "app",
    data() {
        return {
            status:0,
            total: 0,
            pageSize: 15,
            pageNumber: 1,
            data: [],
            loading: false,
            obj: {},
            filterString: '',
            timeout: null
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        filterList
    },
    methods: {
        onPageChange(event) {
            this.pageNumber = event.pageNumber;
            this.pageSize = event.pageSize;
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.loading = true;
            let vm = this;
            let url = 'worksequencetransfer/getQueryList';
            this.$root.getData(url, {
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString,
                status:this.status,
                operatorid:this.$root.userObj.id
            }, function (data) {
                vm.total = data.total;
                vm.data = [];
                data.children.forEach(function (e) {
                    if (e.submit && e.enterwarehouse) {
                        e.inbound = "完成";
                    }
                    if (e.submit && !e.enterwarehouse) {
                        e.inbound = "提交";
                    }
                    vm.data.push(e);
                })
                vm.loading = false;
            })
        },
        selectObj(obj) {
            this.obj = this.clone(obj);
        },
        changeFinish(flag){
            this.status=flag;
        },
        filter(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        },
        finish(){
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("worksequencetransfer/finish", {id: vm.obj.id}, function (data) {
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
