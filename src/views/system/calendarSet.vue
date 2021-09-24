<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'5px'}" :border="false">
                <div class="col-4 p-10"></div>
                <div class="col-4 p-10 text-center">

                    <ButtonGroup selectionMode="single">
                        <LinkButton :toggle="false" class="f-18" @click="up">　<　</LinkButton>
                        <LinkButton :toggle="false" class="f-18">　{{ year }}年{{ month }}月　</LinkButton>
                        <LinkButton :toggle="false" class="f-18" @click="down">　>　</LinkButton>
                    </ButtonGroup>
                </div>
                <div class="col-4 p-10 text-right">
                    <LinkButton iconCls="icon-add" :plain="true" @click="buildNew">生成日历</LinkButton>
                </div>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column" :border="false" class="p-5">
            <div style="width: 100%">
                <div class="col7-title">周一</div>
                <div class="col7-title">周二</div>
                <div class="col7-title">周三</div>
                <div class="col7-title">周四</div>
                <div class="col7-title">周五</div>
                <div class="col7-title">周六</div>
                <div class="col7-title">周日</div>
                <div class="col7" v-for="d in weeks">

                </div>
                <div class="col7" v-for="d in data" :class="{'bgm-teal':d.holidays}" @click="changeHolidays(d)">
                    {{ d.ri }}
                </div>

            </div>
        </LayoutPanel>
    </Layout>
</template>

<script>
export default {
    name: "app",
    data() {
        return {
            year: 0,
            month: 0,
            weeks:0,
            data: []
        }
    },
    created: function () {
        let dt = new Date();
        this.year = dt.getFullYear();
        this.month = dt.getMonth() + 1;
        this.load();
    },
    methods: {
        load: function () {
            let vm = this;
            this.getData("calendar/getList", {
                nian: this.year,
                yue: this.month
            }, function (data) {
                vm.data = data;
                if(vm.data.length>0){
                    vm.weeks=vm.data[0].week-1;
                }
            })
        },
        buildNew() {
            let vm = this;
            this.confirm('生成1000天日历，确认吗?', function () {
                vm.getData("calendar/buildCalender", {}, function (data) {
                    vm.load();
                })
            })
        },
        down() {
            let vm = this;
            this.getData("calendar/getDownYearMonth", {year: this.year, month: this.month}, function (data) {
                vm.year = data.year;
                vm.month = data.month;
                vm.load();
            })
        },
        up() {
            let vm = this;
            this.getData("calendar/getUpYearMonth", {year: this.year, month: this.month}, function (data) {
                vm.year = data.year;
                vm.month = data.month;
                vm.load();
            })
        },
        changeHolidays(obj){
            obj.holidays=!obj.holidays;
            let vm = this;
            this.getData("calendar/save", obj, function (data) {

            })
        }
    }
}
</script>

<style scoped>
.col7 {
    margin: 2px;
    padding: 3px;
    float: left;
    width: calc(14.28571429% - 4px);
    height: 100px;
    line-height: 100px;
    font-size: 30px;
    /*border: 1px solid red;*/
    text-align: center;
    background-color: rgba(0,0,0,0.05);
}
.col7-title {
    margin: 2px;
    padding: 3px;
    float: left;
    width: calc(14.28571429% - 4px);
    height: 50px;
    line-height: 50px;
    /*border: 1px solid red;*/
    text-align: center;
    background-color: rgba(0,0,0,0.05);
}
</style>
