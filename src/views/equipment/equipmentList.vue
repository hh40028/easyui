<template>
    <Layout bodyCls="f-column" style="height:calc(100vh - 50px);">
        <LayoutPanel region="north" style="height:50px;">
            <Panel :bodyStyle="{padding:'5px'}" :border="false">
                <LinkButton iconCls="icon-add" :plain="true" @click="add">新增</LinkButton>
                <LinkButton iconCls="icon-edit" :disabled="!equipment.id" :plain="true" @click="edit">编辑</LinkButton>
                <LinkButton iconCls="icon-search" :disabled="!equipment.id" :plain="true" @click="view">详细</LinkButton>
                <LinkButton iconCls="icon-cut" :disabled="!equipment.id" :plain="true">养护</LinkButton>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%">
            <DataGrid style="height: calc(100vh - 100px)"
                      :border="false"
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
                <GridColumnGroup :frozen="true" align="left" width="280">
                    <GridHeaderRow>
                        <GridColumn title="序号" width="40" align="center" :frozen="true">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{ scope.rowIndex + 1 }}
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="number" title="设备编码" width="120" align="center"></GridColumn>
                        <GridColumn field="name" title="设备名称" width="120" align="center"></GridColumn>
                    </GridHeaderRow>
                </GridColumnGroup>
                <GridColumnGroup>
                    <GridHeaderRow>
                        <GridColumn field="model" title="设备型号" width="180" align="center"></GridColumn>
                        <GridColumn field="norm" title="设备规格" width="180" align="center"></GridColumn>
                        <GridColumn field="usedeptname" title="使用部门" width="120" align="center"></GridColumn>
                        <GridColumn field="size" title="外形尺寸" width="120" align="center"></GridColumn>
                        <GridColumn field="use" title="设备用途" width="100" align="center"></GridColumn>
                        <GridColumn field="weight" title="设备重量(kg)" width="100" align="center"></GridColumn>
                        <GridColumn field="storagelocation" title="存放地点" width="120" align="center"></GridColumn>
                        <GridColumn field="attributionname" title="归属公司" width="120" align="center"></GridColumn>
                        <GridColumn field="originalvalue" title="设备原值" width="120" align="center"></GridColumn>
                        <GridColumn field="manufacturer" title="制造公司" width="120" align="center"></GridColumn>
                        <GridColumn field="principalname" title="设备负责人" width="120" align="center"></GridColumn>
                        <GridColumn field="manufacturedate" title="制造日期" width="120" align="center"></GridColumn>
                        <GridColumn field="statusname" title="设备状态" width="120" align="center"></GridColumn>
                        <GridColumn field="serialnumber" title="出厂编号" width="120" align="center"></GridColumn>
                        <GridColumn field="enabledate" title="启用日期" width="120" align="center"></GridColumn>
                        <GridColumn field="purchasedate" title="采购日期" width="120" align="center"></GridColumn>
                        <GridColumn field="contractnumber" title="合同号" width="120" align="center"></GridColumn>
                    </GridHeaderRow>
                </GridColumnGroup>
            </DataGrid>
            <Dialog ref="editEquipmentDlg" closed
                    :title="'编辑设备'"
                    :dialogStyle="{width:'80vw',height:'80vh'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <Layout bodyCls="f-column" style="height: calc(80vh - 81px)">
                        <LayoutPanel region="east" style="width:20vw;" :border="false">
                            <Layout bodyCls="f-column" style="height: calc(80vh - 83px)">
                                <LayoutPanel region="north" style="height:250px" :split="true">
                                    <Panel class="f-full" title="图片" :bodyStyle="{padding:'5px'}" :panelStyle="{width:'100%',minWidth:'100px'}" :border="false">
                                        <LinkButton iconCls="icon-add" :plain="true" @click="up('photo')">上传图片</LinkButton>
                                    </Panel>
                                    <div class="w-100 p-5" v-for="file in files" :key="file.id" v-if="file.type==='photo'">
                                        <img title="点击删除" @click="removePhoto(file)" class="w-100" :src="$root.basePath+'/common/getImage?filename='+file.filename">
                                    </div>
                                </LayoutPanel>
                                <LayoutPanel bodyCls="f-column" region="center" style="height:100%">
                                    <Panel class="f-full" title="文档" :bodyStyle="{padding:'10px'}" style="height:200px">
                                        <LinkButton iconCls="icon-add" :plain="true" @click="up('attachment')">上传文档</LinkButton>
                                        <a v-for="file in files" :key="file.id" v-if="file.type==='attachment'" @click="download(file.filename)">
                                            <div class="f-14 c-blue" style="overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">{{ file.sourcename }}
                                            </div>
                                        </a>
                                    </Panel>
                                </LayoutPanel>
                            </Layout>
                        </LayoutPanel>
                        <LayoutPanel region="center" style="height:100%">
                            <div class="p-10 col-4">
                                <label>设备编码<span class="c-red">＊</span></label>
                                <input type="text" v-model="equipment.number" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>设备名称<span class="c-red">＊</span></label>
                                <input type="text" v-model="equipment.name" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>设备型号<span class="c-red">＊</span></label>
                                <input type="text" v-model="equipment.model" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>设备规格</label>
                                <input type="text" v-model="equipment.norm" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>使用部门</label>
                                <input type="text" v-model="equipment.usedeptname" readonly class="form-control" @click="selectDept">
                            </div>
                            <div class="p-10 col-4">
                                <label>外形尺寸</label>
                                <input type="text" v-model="equipment.size" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>设备用途</label>
                                <input type="text" v-model="equipment.use" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>设备重量(kg)</label>
                                <input type="number" v-model="equipment.weight" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>设备类型</label>
                                <select v-model="equipment.typeid" class="form-control">
                                    <option v-for="dict in dicts" :key="dict.id" v-show="dict.key==='shebeileixing'" :value="dict.id">{{ dict.name }}</option>
                                </select>
                            </div>
                            <div class="p-10 col-4">
                                <label>存放地点</label>
                                <input type="text" v-model="equipment.storagelocation" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>归属公司</label>
                                <selectSupplier :suppliername="equipment.attributionname" @selectSupplier="selectSupplier" input="true"></selectSupplier>
                            </div>
                            <div class="p-10 col-4">
                                <label>设备原值</label>
                                <input type="number" v-model="equipment.originalvalue" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>制造公司</label>
                                <input type="text" v-model="equipment.manufacturer" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>设备负责人</label>
                                <selectUser :username="equipment.principalname" @selectUser="selectUser" input="true"></selectUser>
                            </div>
                            <div class="p-10 col-4">
                                <label>制造日期</label>
                                <input type="date" v-model="equipment.manufacturedate" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>设备状态</label>
                                <select v-model="equipment.status" class="form-control">
                                    <option v-for="dict in dicts" :key="dict.id" v-show="dict.key==='shebeizhuangtai'" :value="dict.id">{{ dict.name }}</option>
                                </select>
                            </div>
                            <div class="p-10 col-4">
                                <label>出厂编号</label>
                                <input type="text" v-model="equipment.serialnumber" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>启用日期</label>
                                <input type="date" v-model="equipment.enabledate" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>采购日期</label>
                                <input type="date" v-model="equipment.purchasedate" class="form-control">
                            </div>
                            <div class="p-10 col-4">
                                <label>合同号</label>
                                <input type="text" v-model="equipment.contractnumber" class="form-control">
                            </div>
                        </LayoutPanel>
                    </Layout>
                </div>
                <input type="file" :id="'file'" style="display: none" @change="uploadFile">
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="save">保存</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editEquipmentDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectSupplier from '@/components/selectSupplier.vue';
import selectUser from '@/components/selectUser.vue';

export default {
    name: "app",
    data() {
        return {
            total: 0,
            pageSize: 15,
            pageNumber: 1,
            data: [],
            loading: false,
            equipment: {},
            filterString: '',
            timeout: null,
            dicts: [],
            files: []
        }
    },
    created: function () {
        this.loadDicts();
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        selectSupplier, selectUser
    },
    methods: {
        loadDicts() {
            let vm = this;
            this.getData("api/getDictList", {}, function (data) {
                vm.dicts = data;
            })
        },
        onPageChange(event) {
            this.pageNumber = event.pageNumber;
            this.pageSize = event.pageSize;
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.loading = true;
            let vm = this;
            let url = 'equipment/getQueryList';
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
                    vm.data.push(e);
                })
                vm.loading = false;
            })
        },
        selectObj(equipment) {
            this.equipment = this.clone(equipment);
        },
        add() {
            this.equipment = {};
            this.$refs.editEquipmentDlg.open();
        },
        edit() {
            if (!this.equipment.id) {
                this.alert("请选择一行");
            } else {
                this.$refs.editEquipmentDlg.open();
                this.loadFiles(this.equipment.id);
            }
        },
        selectUser(user) {
            this.$set(this.obj, 'principal', user.id);
            this.$set(this.obj, 'principalname', user.username);
        },
        selectSupplier(equipment) {
            this.$set(this.equipment, 'attribution', equipment.id);
            this.$set(this.equipment, 'attributionname', equipment.name);
        },
        selectCommodity(equipment) {
            equipment.commodityid = equipment.id;
            equipment.id = null;
            equipment.bigunit = equipment.bigpackage;
            equipment.bigpackage = false;
            this.list.push(equipment);
        },
        openSelectCommodityDlg() {
            this.$refs.selectCommodity.load();
        },
        save() {
            let vm = this;
            this.getData("equipment/save", this.equipment, function (data) {
                vm.$refs.editEquipmentDlg.close();
                vm.loadPage(vm.pageNumber, vm.pageSize)
            })
        },
        selectDept(dict) {

        },
        loadFiles(id) {
            let vm = this;
            this.getData("attachment/getAllList", {rid: this.equipment.id}, function (data) {
                vm.files = data;
                console.log(data);
            })
        },
        uploadFile() {
            let vm = this;
            let formData = new FormData();
            let name = $("file").val();
            formData.append("file", $("#file")[0].files[0]);
            formData.append("name", name);
            $.ajax({
                url: vm.$root.basePath + "/common/uploadFile?rid=" + this.equipment.id + '&type=' + this.type,
                type: "POST",
                data: formData,
                headers: {
                    token: sessionStorage.token
                },
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                beforeSend: function () {
                    vm.upend = true;
                },
                success: function (data) {
                    if (data.success) {
                        vm.msg('上传成功');
                        vm.loadFiles(vm.equipment.id);
                    } else {
                        vm.handleErrInfo(data);
                    }
                },
            });
        },
        up(type) {
            this.type = type;
            $("#file").val("");
            $("#file").click();
        },
        download(filename) {
            let vm = this;
            this.getData("common/downloadFile", {filename: filename}, function (data) {
            })
        },
        view() {
            sessionStorage.equipmentObj = JSON.stringify(this.equipment);
            this.$router.push('equipmentView');
        },
        removePhoto(obj) {
            let vm = this;
            this.confirm('删除此照片确认吗?', function () {
                vm.getData("attachment/delete", {id: obj.id}, function (data) {
                    vm.loadFiles(vm.equipment.id);
                })
            })
        }
    },
    watch: {
        filterString: {
            handler() {
                let vm = this;
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                }, 500);
            }
        }
    },
}
</script>

<style scoped>

</style>
