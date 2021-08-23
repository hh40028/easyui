<template>
    <div>
        <Layout style="width:100%;height:calc(100vh - 50px);">
            <LayoutPanel region="west" style="width:50%;">
                <div class="title">信息</div>
            </LayoutPanel>
            <LayoutPanel region="center" style="height:100%">
                <Panel title="待办任务" :collapsible="false" :border="false" class="f-full" :bodyStyle="{padding:'0px',height:'calc(100vH - 50)'}">
                    <DataGrid style="height:calc(100vh - 84px)" :title="'待办任务'"
                              :border="false"
                              class="f-full"
                              :columnResizing="true"
                              :lazy="true"
                              :data="data"
                              :total="total"
                              selectionMode="single"
                              :loading="loading"
                              @rowDblClick="edit()"
                              @selectionChange="selectObj($event)"
                              :pageNumber="pageNumber"
                              :pageSize="pageSize"
                              @pageChange="onPageChange($event)"
                              :pagination="true"
                              :pagePosition="'bottom'">
                        <GridColumn field="pdname" title="流程名称" width="120" align="center" :frozen="true"></GridColumn>
                        <GridColumn field="nodename" title="节点名称" width="120" align="center"></GridColumn>
                        <GridColumn field="sendusername" title="发送用户" width="120" align="center"></GridColumn>
                        <GridColumn field="arrivaltime" title="发送时间" width="150" align="center"></GridColumn>
                        <GridColumn field="message" title="处理意见" width="320" align="center"></GridColumn>
                    </DataGrid>
                </Panel>
            </LayoutPanel>
        </Layout>
    </div>
</template>


<script>
export default {
    name: "app",
    data() {
        return {
            total: 0,
            pageSize: 15,
            pageNumber: 1,
            data: [],
            loading: false,
            obj: {}
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
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
            this.getData('api/getProcesstaskQueryList', {
                tablename: 'processtaskview',
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString
            }, function (data) {
                console.log(data);
                vm.total = data.total;
                vm.data = [];
                data.children.forEach(function (e) {
                    vm.data.push(e);
                })
                vm.loading = false;
            })
        },
        selectObj() {

        },
        edit() {

        }
    }
}
</script>

<style scoped>
</style>
