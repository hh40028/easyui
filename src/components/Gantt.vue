<template>
  <div ref="gantt"></div>
</template>

<script>
import "dhtmlx-gantt";

export default {
  name: 'gantt',
  props: {
    tasks: {
      type: Object,
      default () {
        return {data: [], links: []}
      }
    }
  },

  mounted: function () {

    gantt.plugins(
        {tooltip:true,marker:true        }
    );

    gantt.config.date_format = "%Y-%m-%d %H:%i:%s";  //日期格式
    gantt.config.readonly = true;  //只读模式
    gantt.config.duration_unit = "day";  //minute,day,month

    gantt.config.xml_date = "%Y-%m-%d";

    //
    gantt.config.min_column_width=60;
    gantt.config.scale_height=30*2;
    gantt.config.scales=[
      {unit:"year",step:1,date:"%Y年"},
      {unit:"month",step:1,date:"%Y年 %m月"},
      {unit:"day",step:1,date:"%j"}
    ];

    // 设置中文
    gantt.i18n.setLocale("cn");

    //周末进行区分
    gantt.templates.timeline_cell_class = function (item,date){
      if(date.getDay()==0 || date.getDay()==6){
        return 'weekend';
      }
    };

    // 显示列配置
    gantt.config.columns=[
      {name:"text",tree:true,align:"left",resize:true,width:150,label:'计划单号'},
      {name:"commodityname",align:"center",resize:true,width:100,label:'产品名称'},
      {name:"start_date",align:"center",resize:true,width:100,label:'开始时间'},
      {name:"deptName",align:"center",resize:true,width:100,label:'负责单位'},
      {name:"status",align:"center",resize:true,width:100,label:'状态'},
    ];

    //左右容器+滚动条
    gantt.config.layout={
      css:"gantt_container",
      cols:[
        {
          width:400,
          min_width:300,
          rows:[
            {view:"grid",scrollX:"gridScroll",scrollable: true,scrollY:"scrollVer"},
            {view:"scrollbar",id:"gridScroll",group:"horizontal"}
          ]
        },
        {resizer:true,width:1},
        {
          rows:[
            {view:"timeline",scrollX:"scrollHor",scrollY: "scrollVer"},
            {view:"scrollbar",id:"scrollHor",group:"horizontal"}
          ]
        },
        {view:"scrollbar",id:"scrollVer"}
      ]
    };

    //task内容文本
    gantt.templates.task_text=function(start,end,task){
      if(task.start_date!=undefined){
        return ("<b>计划单号:</b>"+task.text+":"+task.commodityname+" ("+task.progress*100+"%)");
      }else{
        return("<b>"+task.text+"</b>");
      }
    };


    //task文本悬浮显示
    //const that = this;
    gantt.templates.tooltip_text=function(start,end,task){

      if(task.start_date!=undefined){
        return(
            "<b>计划单号:</b>"+task.text+
            "</br><b>产品名称:</b>"+task.commodityname+
            "</br><b>开始时间</b>"+ gantt.templates.tooltip_date_format(start)+
            "</br><b>结束时间</b>"+ gantt.templates.tooltip_date_format(end)
        );
      }else{
        return(
            "<b>任务名称:</b>"+task.text
        );
      }
    };

    // 设置子任务条颜色
    gantt.templates.task_class=function (st,end,item){
      return item.$level == 0?"gantt_project":""
    };

    // 考虑跳过周末
    gantt.config.work_time=true;
    gantt.config.correct_work_time=true;
    gantt.config.inherit_scale_class=true;

    // 初始化显示

    this.addTodayLine();
    gantt.config.fit_tasks=true;
    gantt.config.tooltip_timeout=100;

    gantt.init(this.$refs.gantt);
    // gantt.parse(this.$props.tasks);
  },

  methods:{
    //重载甘特图
    reload(){
      gantt.clearAll();
      this.addTodayLine();
      gantt.parse(this.$props.tasks);
      gantt.render();
    },

    //时间线
    addTodayLine(){
      var date_to_str=gantt.date.date_to_str(gantt.config.task_date);
      var today=new Date();
      gantt.addMarker(
          {
            start_date:today,
            css:"today",
            text:"今天",
            title:"今天:"+date_to_str(today)
          }
      );

    },
  }
}
</script>

<style lang="less">
@import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
@import "~dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css";
//操作按钮样式
.fa{
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  opacity: 0.2;
  padding: 5px;
}
.fa.hover{
  opacity: 1;
}
.fa-pencil{
  color: #ffa011;
}
.fa-plus{
  color: #328EA0;
}
.fa-times{
  color: red;
}

//周末样式
.weekend{
  background: #f7f4f6;
}
.gantt_selected .weekend{
  background: #f7eb91;
}
</style>
