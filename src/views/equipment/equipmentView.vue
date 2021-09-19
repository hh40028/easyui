<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="center" style="height:100%" :border="false">
            <Tabs class="f-full" :border="false">
                <TabPanel :title="'设备台账'">
                    <Layout bodyCls="f-column" style="height:calc(100vh - 80px);">
                        <LayoutPanel region="center" style="height:100%">
                            <Panel class="f-full p-5" :bodyStyle="{padding:'5px'}" :panelStyle="{width:'100%',minWidth:'100px'}" :border="false">
                                <table class="w-100" border="1">
                                    <tr>
                                        <td class="text-right" style="width:12.5%">设备编码</td>
                                        <td class="text-left" style="width:12.5%">{{ equipment.number }}</td>
                                        <td class="text-right" style="width:12.5%">设备名称</td>
                                        <td class="text-left" style="width:12.5%">{{ equipment.name }}</td>
                                        <td class="text-right" style="width:12.5%">设备型号</td>
                                        <td class="text-left" style="width:12.5%">{{ equipment.model }}</td>
                                        <td class="text-right" style="width:12.5%">设备规格</td>
                                        <td class="text-left" style="width:12.5%">{{ equipment.norm }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-right">使用部门</td>
                                        <td class="text-left">{{ equipment.usedeptname }}</td>
                                        <td class="text-right">外形尺寸</td>
                                        <td class="text-left">{{ equipment.size }}</td>
                                        <td class="text-right">设备用途</td>
                                        <td class="text-left">{{ equipment.use }}</td>
                                        <td class="text-right">设备重量(kg)</td>
                                        <td class="text-left">{{ equipment.weight }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-right">设备类型</td>
                                        <td class="text-left">{{ equipment.typename }}</td>
                                        <td class="text-right">存放地点</td>
                                        <td class="text-left">{{ equipment.storagelocation }}</td>
                                        <td class="text-right">归属公司</td>
                                        <td class="text-left">{{ equipment.attributionname }}</td>
                                        <td class="text-right">设备原值</td>
                                        <td class="text-left">{{ equipment.originalvalue }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-right">制造公司</td>
                                        <td class="text-left">{{ equipment.manufacturer }}</td>
                                        <td class="text-right">设备负责人</td>
                                        <td class="text-left">{{ equipment.principalname }}</td>
                                        <td class="text-right">制造日期</td>
                                        <td class="text-left">{{ equipment.manufacturedate }}</td>
                                        <td class="text-right">设备状态</td>
                                        <td class="text-left">{{ equipment.status }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-right">出厂编号</td>
                                        <td class="text-left">{{ equipment.serialnumber }}</td>
                                        <td class="text-right">启用日期</td>
                                        <td class="text-left">{{ equipment.enabledate }}</td>
                                        <td class="text-right">采购日期</td>
                                        <td class="text-left">{{ equipment.purchasedate }}</td>
                                        <td class="text-right">合同号</td>
                                        <td class="text-left">{{ equipment.contractnumber }}</td>
                                    </tr>
                                </table>
                                <div class="m-t-20">
                                    <div style="float: left" v-for="file in files" :key="file.id" v-show="file.type==='photo'" class="p-5">
                                        <img style="height: 300px" :src="$root.basePath+'/common/getImage?filename='+file.filename">
                                    </div>
                                </div>
                            </Panel>
                        </LayoutPanel>
                    </Layout>
                </TabPanel>
                <TabPanel :title="'养护记录'">
                    <p>设备台账</p>
                </TabPanel>
                <TabPanel :title="'维修记录'">
                    <p>维修记录</p>
                </TabPanel>
            </Tabs>
        </LayoutPanel>
    </Layout>
</template>

<script>
export default {
    name: "app",
    data() {
        return {
            equipment: {},
            files: []
        }
    },
    created: function () {
        this.equipment = JSON.parse(sessionStorage.equipmentObj);
        this.loadFiles(this.equipment.id);
    },
    methods: {
        loadFiles(id) {
            let vm = this;
            this.getData("attachment/getAllList", {rid: this.equipment.id}, function (data) {
                vm.files = data;
                console.log(data);
            })
        },
    }
}
</script>

<style scoped>
</style>
