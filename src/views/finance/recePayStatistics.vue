<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'8px'}" :border="false">
                <ButtonGroup selectionMode="single">
                    <LinkButton :toggle="true" @click="changeType('customer')" :selected="api==='customer'">客户</LinkButton>
                    <LinkButton :toggle="true" @click="changeType('supplier')" :selected="api==='supplier'">供应商</LinkButton>
                </ButtonGroup>
                <LinkButton iconCls="icon-ok" class="m-l-30" :disabled="!obj" :plain="true" @click="$refs.viewHistoryDlg.open()">往来明细</LinkButton>
                <div class="pull-right">
                    <filterList @filterLoad="filter"></filterList>
                </div>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column" :border="false">
            <DataGrid :border="false" ref="dgList"
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
                <GridColumn title="序号" width="50" align="center">
                    <template slot="body" slot-scope="scope">
                        <div class="item">
                            {{ scope.rowIndex + 1 }}
                        </div>
                    </template>
                </GridColumn>
                <GridColumn field="name" title="名称" align="center"></GridColumn>
                <GridColumn field="area" title="区域" align="center"></GridColumn>
                <GridColumn field="contactperson" title="联系人" align="center"></GridColumn>
                <GridColumn field="contactnumber" title="联系电话" align="center"></GridColumn>
                <GridColumn v-if="api==='customer'" field="receivedays" title="账期(天)" align="center"></GridColumn>
                <GridColumn field="overage" :title="api==='customer'?'应收余额':'应付余额'" align="right">
                    <template slot="body" slot-scope="scope">
                        <div class="item">{{ toMoney(scope.row.overage, '￥') }}
                        </div>
                    </template>
                </GridColumn>
            </DataGrid>
            <Dialog ref="viewHistoryDlg" closed v-if="obj"
                    :title="obj.name+' - 往来发生明细'"
                    :dialogStyle="{width:'60vw',height:'60vh'}"
                    :modal="true">
                <div class="f-full">
                    <!--494=应收账款,538=应付账款-->
                    <customerAccountHistory :unitid="obj.id" :name="obj.name" :accountid="api==='customer'?494:538"></customerAccountHistory>
                </div>
            </Dialog>

        </LayoutPanel>
    </Layout>
</template>

<script>
import filterList from '@/components/filterList.vue';
import customerAccountHistory from '@/components/customerAccountHistory.vue';

export default {
    name: "app",
    data() {
        return {
            total: 0,
            pageSize: 15,
            pageNumber: 1,
            data: [],
            loading: false,
            obj: null,
            isRedback: false,
            filterString: '',
            timeout: null,
            api: 'customer'
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        customerAccountHistory, filterList
    },
    methods: {
        changeType(type) {
            this.api = type;
            this.obj=null;
            this.$refs.dgList.clearSelections();
            this.loadPage(this.pageNumber, this.pageSize);
        },
        onPageChange(event) {
            this.pageNumber = event.pageNumber;
            this.pageSize = event.pageSize;
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.loading = true;
            let vm = this;
            let url = this.api + '/getQueryList';
            this.$root.getData(url, {
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString
            }, function (data) {
                vm.total = data.total;
                vm.data = [];
                data.children.forEach(function (e) {
                    if (!isNaN(e.amount)) {
                        e.amount = e.amount.toFixed(2);
                    }
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
            this.obj = obj;
        },
        filter(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        },
    }
}
</script>

<style scoped>

</style>
