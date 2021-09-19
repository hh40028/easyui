<template>
    <div>
        <input v-if="input" type="text" v-model="name" :class="{'form-control':form,'w-100':!form}" @click="open">
        <Dialog ref="selectCargolocationDlg" closed
                :title="'选择货位'"
                :dialogStyle="{width:'30%',height:'300px'}"
                :modal="true">

            <div class="f-full" :border="false">
                <Layout bodyCls="f-column" :border="false">
                    <LayoutPanel region="center" style="height:100%" bodyCls="f-column" :border="false">
                        <TreeGrid class="f-full" :border="false"
                                  :data="data" idField="id" treeField="number" @selectionChange="selection($event)">
                            <GridColumn field="number" title="货位编号"></GridColumn>
                            <GridColumn field="count" title="商品数量" align="right">
                                <template slot="body" slot-scope="scope">
                                    <div class="item">
                                        {{ scope.row.count }}{{ ' ' + scope.row.unit }}
                                    </div>
                                </template>
                            </GridColumn>
                        </TreeGrid>
                    </LayoutPanel>
                </Layout>
            </div>
        </Dialog>
    </div>
</template>

<script>
export default {
    props: {
        warehouseid: {
            type: Number,
            default: 0
        },
        input: {
            type: Boolean,
            default: 0
        },
        name: {
            type: String,
            default: ''
        },
        form: {
            type: Boolean,
            default: false
        },
        commodityid: {
            type: Number,
            default: 0
        }
    },
    name: "app",
    data() {
        return {
            data: []
        }
    },
    computed: {
        reload() {
            this.load();
        }
    },
    created: function () {
    },
    methods: {
        load: function () {
            let vm = this;
            this.getData("cargolocation/getTreeNotWarehouse", {
                warehouseId: this.warehouseid,
                commodityid: this.commodityid
            }, function (data) {
                vm.data = data;
                console.log(data);
            })
        },
        open() {

            if (!this.warehouseid) {
                this.alert('请先选择仓库');
            } else {
                this.$refs.selectCargolocationDlg.open();
                if (!this.data.length) {
                    this.load();
                }
            }
        },
        selection(obj) {
            this.$refs.selectCargolocationDlg.close();
            this.$emit('selectCargolocationObj', obj);
        }
    },
    watch: {
        warehouseid: {
            handler() {
                this.load();
            }
        }
    },
}
</script>

<style scoped>

</style>
