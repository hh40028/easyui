<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'5px'}">
                <div class="pull-right">
                    <LinkButton :plain="true" @click="$router.push('shengChanJiHua')">生产计划</LinkButton>
                </div>
<!--                <ButtonGroup selectionMode="single">-->
<!--                    <LinkButton :toggle="true" :selected="true">Add</LinkButton>-->
<!--                    <LinkButton :toggle="true" :selected="true">Add</LinkButton>-->
<!--                    <LinkButton :toggle="true" :selected="true">Add</LinkButton>-->
<!--                    <LinkButton :toggle="true" :selected="true">Add</LinkButton>-->
<!--                    <LinkButton :toggle="true" :selected="true">Add</LinkButton>-->
<!--                </ButtonGroup>-->
            </Panel>
        </LayoutPanel>
        <!--        <LayoutPanel region="south" style="height:30%;" :border="false">-->
        <!--            <div class="title">South Region</div>-->
        <!--        </LayoutPanel>-->
        <LayoutPanel region="center" style="height:100%" :border="false">
            <gantt ref="gantt" class="left-container" :tasks="tasks"></gantt>
        </LayoutPanel>
    </Layout>
</template>

<script>

import Gantt from '@/components/Gantt.vue';

export default {
    name: "ganttView",
    components: {Gantt},
    data() {
        return {
            tasks: {
                data: [],
                links: []
            },
        }
    },
    created() {
        this.readTaskList();
    },
    mounted: function () {
        this.reloadGantt();
    },
    methods: {
        readTaskList() {
            let vm = this;
            this.getData("productionplan/getGanttView", {}, function (data) {
                vm.tasks.data = data;
                console.log(data);
                vm.reloadGantt();
            })
        },
        reloadGantt() {
            this.$refs.gantt.reload();
        }
    }
}
</script>

<style scoped>

.left-container {
    overflow: hidden;
    position: relative;
    height: 100%;
}
</style>
