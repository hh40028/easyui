<template>
  <div class="container">
    <gantt ref="gantt" class="left-container" :tasks="tasks"></gantt>
  </div>
</template>

<script>

import Gantt from '@/components/Gantt.vue';

export default {
  name: "ganttView",
  components: {Gantt},
  data () {
    return {
      tasks: {
        data: [],
        links: []
      },
    }
  },

  created(){
    this.readTaskList();
  },

  mounted:function (){
    this.reloadGantt();
  },

  methods:{
    readTaskList() {
      let vm = this;

      this.getData("productionplan/getGanttView", {}, function (data) {
        vm.tasks.data =data;
        vm.reloadGantt();
      },function (){
        console.log("gettree is failur!");
      })
    },

    reloadGantt(){
      this.$refs.gantt.reload();
    }
  }
}
</script>

<style scoped>
html, body {
  height: 500px;
  margin: 0;
  padding: 0;
}
.container {
  height: 500px;
  width: 100%;
}
.left-container {
  overflow: hidden;
  position: relative;
  height: 500px;
}
</style>
