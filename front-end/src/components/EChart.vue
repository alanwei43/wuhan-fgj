<template>
  <div class="hello">
    <p style="font-size: 14px">
      数据来源:
      <a
        href="http://fgj.wuhan.gov.cn/xxgk/xxgkml/sjfb/mrxjspfcjtjqk/"
        target="_blank"
        >每日新建商品房成交统计情况-武汉市住房保障和房屋管理局</a
      >
    </p>
    <div style="font-size: 16px">
      <span>范围: </span>
      <input type="date" v-model="data.range.start" /> -
      <input type="date" v-model="data.range.end" />
    </div>
    <div style="font-size: 16px">
      <span>区域:</span>
      <label
        v-for="area in data.areas"
        :key="area.name"
        style="display: inline; width: auto; padding: 5px 8px"
        ><input type="checkbox" v-model="area.checked" /> {{ area.name }}</label
      >
      <button @click="toggleAll">全部</button>
    </div>
    <div>
      <button @click="refresh">刷新</button>
    </div>
    <hr />
    <div
      id="main"
      style="width: 100%; height: 600px"
      :key="data.chartKey"
    ></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { query } from "../services/index";

export default {
  data() {
    return {
      data: {
        range: {
          start: "",
          end: "",
        },
        areas: [],
        chartKey: "",
      },
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      query({ top: 1 }).then((res) => {
        const first = res[0];
        this.data.areas = first.residentials.map((item) => ({
          checked: true,
          name: item.district,
        }));
      });
    },
    refresh() {
      if (this.data.areas.length === 0) {
        alert("没有数据");
        return;
      }

      query({
        start: parseInt(this.data.range.start.replace(/-/g, "")),
        end: parseInt(this.data.range.end.replace(/-/g, "")),
      }).then((res) => {
        if (res.length === 0) {
          return;
        }
        
        const list = res;
        const columnNames = this.data.areas
          .filter((item) => item.checked)
          .map((item) => item.name);
        const options = {
          title: {
            // text: "Hello",
            // subtext: "World",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: columnNames,
          },
          toolbox: {
            show: true,
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true },
            },
          },
          calculable: true,
          xAxis: [
            {
              type: "category",
              data: list.map((item) => item.day),
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: columnNames.map((colKey) => ({
            name: colKey,
            type: "bar",
            data: list
              .map((item) => item.groups[colKey] || {})
              .map((item) => item.count || 0),
          })),
        };

        // console.log(options);
        this.renderChart(options);
      });
    },
    renderChart(options) {
      this.data.chartKey = Date.now().toString(16);
      this.$nextTick(() => {
        const chart = echarts.init(document.getElementById("main"));
        chart.setOption(options);
      });
    },
    toggleAll() {
      const firstStatus = !this.data.areas[0].checked;
      this.data.areas.forEach((item) => {
        item.checked = firstStatus;
      });
    },
  },
};
</script>

<style scoped>
</style>
