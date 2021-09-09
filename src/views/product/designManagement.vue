<template>
    <Layout bodyCls="f-column" style="height:calc(100vh - 50px);">
        <LayoutPanel region="north" style="height:50px;">
            <div class="col-9">
                <Panel :bodyStyle="{paddingTop:'8px'}" :border="false">
                    <LinkButton iconCls="icon-add" :plain="true" @click="add">新增</LinkButton>
                    <LinkButton :disabled="!obj.id || obj.status>0" iconCls="icon-edit" :plain="true" @click="edit">编辑</LinkButton>
                    <LinkButton :disabled="obj.id && obj.status===1" iconCls="icon-edit" :plain="true" @click="openDocumentDlg">设计文档</LinkButton>
                    <LinkButton :disabled="obj.id && obj.status===1" iconCls="icon-ok" :plain="true" @click="openFinishDlg">完成</LinkButton>
                    <LinkButton :disabled="!obj.id" iconCls="icon-search" :plain="true" @click="view">查看</LinkButton>
                </Panel>
            </div>
            <div class="col-3 p-5">
                <filterList @filterLoad="filter"></filterList>
            </div>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column">
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
                <GridColumnGroup :frozen="true" align="left" width="520">
                    <GridHeaderRow>
                        <GridColumn title="序号" width="40" align="center" :frozen="true">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    {{ scope.rowIndex + 1 }}
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="status" title="当前状态" width="120" align="center">
                            <template slot="body" slot-scope="scope">
                                <div class="item">
                                    <span v-if="scope.row.status===0">开始</span>
                                    <span v-if="scope.row.status===1">完成</span>
                                </div>
                            </template>
                        </GridColumn>
                        <GridColumn field="number" title="设计编码" width="120" align="center"></GridColumn>
                        <GridColumn field="commoditynumber" title="产品编码" width="120" align="center"></GridColumn>
                        <GridColumn field="name" title="产品名称" width="120" align="center"></GridColumn>
                    </GridHeaderRow>
                </GridColumnGroup>
                <GridColumnGroup>
                    <GridHeaderRow>
                        <GridColumn field="norm" title="产品规格" width="180" align="center"></GridColumn>
                        <GridColumn field="model" title="产品型号" width="180" align="center"></GridColumn>
                        <GridColumn field="designername" title="设计师" width="180" align="center"></GridColumn>
                        <GridColumn field="starttime" title="开始时间" width="180" align="center"></GridColumn>
                        <GridColumn field="completetime" title="完成时间" width="180" align="center"></GridColumn>
                        <GridColumn field="remark" title="说明" width="180" align="center"></GridColumn>
                    </GridHeaderRow>
                </GridColumnGroup>
            </DataGrid>
            <Dialog ref="editDesignManagementDlg" closed
                    :title="'编辑产品设计信息'"
                    :dialogStyle="{width:'500px',height:'520px'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <div class="p-10 col-6">
                        <label>设计编码<span class="c-red">＊</span></label>
                        <input type="text" v-model="obj.number" class="form-control">
                    </div>
                    <div class="p-10 col-6">
                        <label>设计师<span class="c-red">＊</span></label>
                        <selectUser :input="true" @selectUser="selectUser" :username="obj.designername"></selectUser>
                    </div>
                    <div class="p-10 col-6">
                        <label>开始日期<span class="c-red">＊</span></label>
                        <input type="date" v-model="obj.starttime" class="form-control">
                    </div>
                    <div class="p-10 col-6">
                        <label>产品编号<span class="c-red">＊</span></label>
                        <input type="text" v-model="obj.commoditynumber" class="form-control" @click="openSelectCommodityDlg">
                    </div>
                    <div class="p-10 col-6">
                        <label>产品名称</label>
                        <input type="text" readonly v-model="obj.name" class="form-control">
                    </div>
                    <div class="p-10 col-6">
                        <label>产品规格</label>
                        <input type="text" readonly v-model="obj.norm" class="form-control">
                    </div>
                    <div class="p-10 col-6">
                        <label>产品型号</label>
                        <input type="text" readonly v-model="obj.model" class="form-control">
                    </div>
                    <div class="p-10 col-12">
                        <label>设计说明</label>
                        <textarea style="height: 80px" class="form-control" v-model="obj.remark"></textarea>
                    </div>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="save">保存</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editDesignManagementDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
            <Dialog ref="editFinishDlg" closed
                    :title="'设置完成日期'"
                    :dialogStyle="{width:'300px',height:'180px'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <div class="col-12 p-10">
                        <label>完成日期</label>
                        <input type="date" v-model="obj.completetime" class="form-control">
                    </div>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="finish">完成设计</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.editFinishDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
            <Dialog ref="editDocumentDlg" closed
                    :title="'设计文档'"
                    :dialogStyle="{width:'60vw',height:'50vh'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="dialog-toolbar">
                    <LinkButton iconCls="icon-add" :plain="true" @click="up">上传</LinkButton>
                    <LinkButton :disabled="!document.id" iconCls="icon-remove" :plain="true" @click="deleteDocument">删除</LinkButton>
                </div>
                <div class="f-full">
                    <DataGrid
                        :border="false"
                        class="f-full"
                        :data="documents"
                        :columnResizing="true"
                        selectionMode="single"
                        @selectionChange="selectDocument($event)">
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
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="$refs.editDocumentDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>
            <Dialog ref="viewDesignDlg" closed
                    :title="'产品设计'"
                    :dialogStyle="{width:'800px',height:'600px'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <designManagementView ref="designManagementViewCom" :id="obj.id"></designManagementView>
                </div>
                <div class="dialog-button text-center">
                    <LinkButton style="width:80px" @click="$refs.viewDesignDlg.close()">关闭</LinkButton>
                </div>
            </Dialog>

            <input type="file" :id="'file'" style="display: none" @change="uploadFile">
            <selectCommodity ref="selectCommodityCom" :single="true" @selectCommodity="selectCommodity"></selectCommodity>
        </LayoutPanel>
    </Layout>
</template>

<script>
import selectCommodity from "@/components/selectCommodity";
import selectUser from "@/components/selectUser";
import designManagementView from "@/components/designManagementView.vue";
import filterList from "@/components/filterList.vue";

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
            obj: {},
            documents: [],
            document: {}
        }
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
    },
    components: {
        selectCommodity, selectUser, designManagementView, filterList
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
            let url = 'designmanagement/getQueryList';
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
        add() {
            this.obj = {};
            this.$refs.editDesignManagementDlg.open();
        },
        selectObj(obj) {
            this.obj = this.clone(obj);
        },
        save() {
            let vm = this;
            this.getData("designmanagement/save", this.obj, function (data) {
                vm.loadPage(vm.pageNumber, vm.pageSize);
                vm.$refs.editDesignManagementDlg.close();
            })
        },
        selectUser(obj) {
            this.$set(this.obj, 'designer', obj.id);
            this.$set(this.obj, 'designername', obj.username);
        },
        openSelectCommodityDlg() {
            this.$refs.selectCommodityCom.load();
        },
        selectCommodity(obj) {
            this.$set(this.obj, 'commodityid', obj.id);
            this.$set(this.obj, 'commoditynumber', obj.number);
            this.$set(this.obj, 'name', obj.name);
            this.$set(this.obj, 'norm', obj.norm);
            this.$set(this.obj, 'model', obj.model);
        },
        edit() {
            this.$refs.editDesignManagementDlg.open();
        },
        openFinishDlg() {
            this.$refs.editFinishDlg.open();
        },
        finish() {
            if (!this.obj.completetime) {
                this.alert('请选择完成日期');
            } else {
                let vm = this;
                this.getData("designmanagement/finish", {
                    id: this.obj.id,
                    completetime: this.obj.completetime
                }, function (data) {
                    vm.obj = {};
                    vm.$refs.editFinishDlg.close();
                    vm.loadPage(vm.pageNumber, vm.pageSize);
                })
            }
        },
        openDocumentDlg() {
            this.$refs.editDocumentDlg.open();
            this.loadFiles();
        },
        selectDocument(obj) {
            this.document = obj;
        },
        loadFiles() {
            let vm = this;
            this.getData("attachment/getAllList", {rid: this.obj.id}, function (data) {
                vm.documents = data;
            })
        },
        uploadFile() {
            let vm = this;
            let formData = new FormData();
            let name = $("file").val();
            formData.append("file", $("#file")[0].files[0]);
            formData.append("name", name);
            $.ajax({
                url: vm.$root.basePath + "/common/uploadFile?rid=" + this.obj.id + '&type=doc',
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
        up() {
            $("#file").val("");
            $("#file").click();
        },
        deleteDocument() {
            let vm = this;
            this.confirm('确认吗?', function () {
                vm.getData("attachment/delete", {id: vm.document.id}, function (data) {
                    vm.loadFiles();
                })
            })
        },
        view() {
            this.$refs.viewDesignDlg.open();
        },
        filter(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        }
    }
}
</script>

<style scoped>

</style>
