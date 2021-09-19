<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <div class="col-3 p-5">
                <LinkButton iconCls="icon-add" :plain="true" @click="add">新增</LinkButton>
                <LinkButton iconCls="icon-edit" :disabled="!orgObj" :plain="true" @click="edit">编辑</LinkButton>
                <LinkButton iconCls="icon-reload" :plain="true" @click="load">刷新</LinkButton>
            </div>
            <div class="col-3 p-5"></div>
            <div class="col-3 p-5"></div>
            <div class="col-3 p-5">
                <SearchBox class="form-control"
                           placeholder="过滤..."
                           v-model="filterString"
                           @search="load($event)">
                    <Addon>
                        <span v-if="filterString" class="textbox-icon icon-clear" title="Clear value" @click="filterString=null"></span>
                    </Addon>
                </SearchBox>
            </div>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column" :border="false">
            <TreeGrid class="f-full"
                      :border="false"
                      :striped="true"
                      @rowDblClick="edit"
                      :data="list" @selectionChange="selectObj($event)"
                      idField="id" treeField="name">
                <GridColumn field="name" title="部门名称" width="150"></GridColumn>
                <GridColumn field="area" title="所在区域" align="center" width="130"></GridColumn>
                <GridColumn field="address" title="办公地址" align="center" width="120"></GridColumn>
            </TreeGrid>
            <Dialog ref="dlgEdit" closed
                    :title="'编辑部门'"
                    :dialogStyle="{width:'400px',height:'320px'}"
                    bodyCls="f-column"
                    :modal="true">
                <div class="f-full">
                    <div class="col-12 p-10">
                        <label>部门名称</label>
                        <input type="text" v-model="orgObj.name" class="form-control">
                    </div>
                    <div class="col-12 p-10">
                        <label>所在区域</label>
                        <input type="text" v-model="orgObj.area" class="form-control">
                    </div>
                    <div class="col-12 p-10">
                        <label>办公地址</label>
                        <input type="text" v-model="orgObj.address" class="form-control">
                    </div>
                </div>
                <div class="dialog-button">
                    <LinkButton style="width:80px" @click="save">保存</LinkButton>
                    <LinkButton style="width:80px" @click="$refs.dlgEdit.close()">关闭</LinkButton>
                </div>
            </Dialog>
        </LayoutPanel>
    </Layout>
</template>

<script>

export default {
    data() {
        return {
            list: [],
            filterString: '',
            tree: [],
            children: [],
            orgObj: {},
            selectRow: null,
            node: {},
            pid: -1
        };
    },
    created() {
        this.load();
    },
    methods: {
        load() {
            let vm = this;
            this.getData("api/getOrgTree", {}, function (data) {
                vm.list = [];
                data.forEach(function (e) {
                    vm.list.push(e);
                })
                console.log(data);
            });
        },
        add() {
            if (this.pid < 0) {
                this.alert("请选择一个部门");
            } else {
                this.orgObj = {
                    pid: this.pid
                }
                this.$refs.dlgEdit.open();
            }
        },
        selectObj(obj) {
            this.pid = obj.id;
            this.orgObj = {
                id: obj.id,
                level: obj.level + 1,
                name: obj.name,
                area: obj.area,
                address: obj.address,
                pid: obj.pid
            };
        },
        edit() {
            if (!this.orgObj.id) {
                this.alert('请选择一个部门');
            } else {
                this.$refs.dlgEdit.open();
            }
        },
        save() {
            let vm = this;
            this.getData("api/saveOrganization", this.orgObj, function (data) {
                vm.$refs.dlgEdit.close();
                vm.org = {};
                vm.load();
            })
        }
    }
};
</script>
