import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Calendar, TrendingUp } from 'lucide-react';

interface MatchRecord {
  year: number;
  event: string;
  result: number; // 0-100 成绩指数
  highlight: string;
  detail: string;
}

const records: MatchRecord[] = [
  { year: 2016, event: '新生杯', result: 10, highlight: '队史首球', detail: '三战皆负，肖潇打入新闻男足历史上第一粒正式比赛进球' },
  { year: 2017, event: '华工杯', result: 5, highlight: '至暗时刻', detail: '0:10惨败法学院，后两场因人数不足弃权，几乎解散' },
  { year: 2018, event: '新生杯', result: 25, highlight: '历史首胜', detail: '1:0战胜外国语学院，新闻男足迎来第一场正式比赛胜利' },
  { year: 2019, event: '华工杯', result: 15, highlight: '苦苦坚持', detail: '三连败，但球队凝聚力和拉拉队文化开始形成' },
  { year: 2020, event: '疫情停办', result: 0, highlight: '暂停的一年', detail: '新冠疫情爆发，华工杯停办，球队训练几乎中断' },
  { year: 2021, event: '华工杯', result: 55, highlight: '首次出线', detail: '2:1战胜网安，队史第一场华工杯胜利，首次小组出线' },
  { year: 2022, event: '华工杯', result: 80, highlight: '黄金一代', detail: '三战全胜出线，半决赛点球大战失利，最终获得殿军' },
  { year: 2023, event: '华工杯', result: 60, highlight: '黄金谢幕', detail: '黄金一代退役，八强战中点球大战不敌航空航天' },
  { year: 2024, event: '华工杯', result: 20, highlight: '欧亨利式失败', detail: '2:5不敌外国语，小组未出线，重建阵痛' },
  { year: 2025, event: '华工杯', result: 50, highlight: '绝境突围', detail: '3:1战胜软件学院小组突围，淘汰赛1:5不敌集成' },
  { year: 2026, event: '华工杯', result: 95, highlight: '十年圆梦', detail: '小组突围，3:1化学杀入四强，最终5:2中欧夺得季军，创造队史最佳' }
];

export const TimelinePage = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '新闻男足 2016-2026 战绩曲线',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#22c55e',
        textStyle: { color: '#fff' },
        formatter: (params: { dataIndex: number }[]) => {
          const data = records[params[0].dataIndex];
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; color: #22c55e; margin-bottom: 4px;">${data.year} · ${data.event}</div>
              <div style="color: #fbbf24; margin-bottom: 4px;">${data.highlight}</div>
              <div style="color: #94a3b8; font-size: 12px; max-width: 240px;">${data.detail}</div>
            </div>
          `;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: records.map(r => r.year.toString()),
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { color: '#94a3b8', fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        name: '成绩指数',
        nameTextStyle: { color: '#94a3b8' },
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#334155', type: 'dashed' } },
        max: 100
      },
      series: [
        {
          name: '成绩指数',
          type: 'line',
          data: records.map(r => r.result),
          smooth: true,
          symbol: 'circle',
          symbolSize: 10,
          lineStyle: {
            color: '#22c55e',
            width: 4,
            shadowColor: 'rgba(34, 197, 94, 0.5)',
            shadowBlur: 10
          },
          itemStyle: {
            color: '#22c55e',
            borderColor: '#fff',
            borderWidth: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(34, 197, 94, 0.4)' },
              { offset: 1, color: 'rgba(34, 197, 94, 0.05)' }
            ])
          },
          markPoint: {
            data: [
              { name: '首球', coord: ['0', 10], value: '首球', itemStyle: { color: '#fbbf24' } },
              { name: '首胜', coord: ['2', 25], value: '首胜', itemStyle: { color: '#fbbf24' } },
              { name: '首出线', coord: ['5', 55], value: '首出线', itemStyle: { color: '#fbbf24' } },
              { name: '四强', coord: ['6', 80], value: '四强', itemStyle: { color: '#f97316' } },
              { name: '季军', coord: ['10', 95], value: '季军', itemStyle: { color: '#ef4444' } }
            ],
            label: { color: '#fff', fontSize: 10 }
          }
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900 text-white">
      <header className="flex items-center justify-between p-4 bg-slate-900/90 backdrop-blur-sm border-b-4 border-green-500">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="pixel-text">返回主页</span>
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="font-bold pixel-text">十年战绩</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400">
              新闻男足十年征程
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            从 2016 年三战皆负的新生杯，到 2026 年创造历史的华工杯季军。
            这是一条用失败、坚持与热爱铺就的曲线。
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-8">
          <div ref={chartRef} className="w-full h-80 md:h-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.filter(r => r.highlight).map((record) => (
            <div
              key={record.year}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-green-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{record.year}</div>
                  <div className="text-xs text-green-400">{record.event}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold text-sm">{record.highlight}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{record.detail}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
