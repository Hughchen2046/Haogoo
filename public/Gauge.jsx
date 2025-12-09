import ReactECharts from "echarts-for-react";

export default function HaoGooGauge({
  value = 0.25,
  name = "Haogoo"
}) {
  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        center: ["50%", "60%"],
        radius: "80%",
        min: 0,
        max: 1,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.1, "#FF6E76"],
              [0.4, "#FDDD60"],
              [0.6, "#58D9F9"],
              [0.9, "#de85c0"],
              [1, "#7CFFB2"]
            ]
          }
        },
        pointer: {
          icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
          length: "12%",
          width: 20,
          offsetCenter: [0, "-60%"],
          itemStyle: { color: "auto" }
        },
        axisTick: {
          length: 12,
          lineStyle: { color: "auto", width: 2 }
        },
        splitLine: {
          length: 20,
          lineStyle: { color: "auto", width: 5 }
        },
        axisLabel: {
          color: "#ffffffff",
          fontSize: 12,
          distance: -50,
          rotate: "tangential",
          formatter(value) {
            if (value === 0.9) return "[簡報製作]";
            if (value === 0.6) return "[專案開發]";
            if (value === 0.4) return "[設計稿申請]";
            if (value === 0.1) return "[線稿圖]";
            if (value === 0.0) return "[Start]";
            return "";
          }
        },
        title: {
          offsetCenter: [0, "-10%"],
          fontSize: 20
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, "-35%"],
          valueAnimation: true,
          formatter(v) {
            return Math.round(v * 100) + "";
          },
          color: "inherit"
        },
        data: [{ value, name }]
      }
    ]
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 350, width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
