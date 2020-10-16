<template>
  <div>
    <div id="function-area">
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
        <span v-if="data.areas.load === 'loading'">加载中...</span>
        <span v-if="data.areas.load === 'fail'" @click="retry"
          >加载失败, 点击重试.</span
        >
        <label
          v-for="area in data.areas.list"
          :key="area.name"
          style="display: inline; width: auto; padding: 5px 8px"
          ><input type="checkbox" v-model="area.checked" />
          {{ area.name }}</label
        >
        <button @click="toggleAll">全部</button>
      </div>
      <div>
        <button @click="refresh" style="font-size: 18px">查询</button>
      </div>
    </div>
    <!-- <div style="height: 200px"></div> -->
    <div id="charts">
      <div
        ref="AreaChart"
        id="area-chart"
        style="width: 100%; height: 600px"
        :key="data.chartKey + 'AreaChart'"
      ></div>
      <div
        ref="AreaSumChart"
        id="area-sum-chart"
        style="width: 100%; height: 600px"
        :key="data.chartKey + 'AreaSum'"
      ></div>
    </div>
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
        areas: {
          load: undefined,
          list: [],
        },
        chartKey: "",
      },
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.data.areas.load = "loading";
      query({ top: 1 })
        .then((res) => {
          this.data.areas.load = "success";
          const first = res[0];
          this.data.areas.list = first.residentials.map((item) => ({
            checked: true,
            name: item.district,
          }));
        })
        .catch((err) => {
          console.warn(err);
          this.data.areas.load = "fail";
        });
    },
    refresh() {
      if (this.data.areas.list.length === 0) {
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

        console.log(res);
        const list = res;
        const columnNames = this.data.areas.list
          .filter((item) => item.checked)
          .map((item) => item.name);
        const areaOptions = {
          title: {
            text: "区域统计",
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

        const areaSumOptions = {
          title: {
            text: "总和统计",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: list.map((item) => item.day),
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
          series: {
            name: "总和",
            type: "bar",
            data: list.map((item) =>
              columnNames.reduce(
                (prevCount, nextKey) =>
                  prevCount + (item.groups[nextKey].count || 0),
                0
              )
            ),
          },
        };
        // })),

        this.renderChart(areaOptions, this.$refs.AreaChart.id);
        this.renderChart(areaSumOptions, this.$refs.AreaSumChart.id);
      });
    },
    renderChart(options, id) {
      console.log(`${id}: `, options);
      this.data.chartKey = Date.now().toString(16);
      this.$nextTick(() => {
        const chart = echarts.init(document.getElementById(id));
        chart.setOption(options);
      });
    },
    toggleAll() {
      const firstStatus = !this.data.areas.list[0].checked;
      this.data.areas.list.forEach((item) => {
        item.checked = firstStatus;
      });
    },
    retry() {
      this.initData();
    },
  },
};
</script>

<style scoped>
#function-area {
  opacity: 1;
}
#function-area * {
  opacity: 1;
}
</style>
