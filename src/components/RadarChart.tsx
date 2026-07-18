import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { CampusPlayer, StarPlayer } from '../data/playerTypes';

interface RadarChartProps {
  campusPlayer: CampusPlayer;
  starPlayer: StarPlayer;
  similarity?: number;
  height?: number;
  className?: string;
}

const STAT_LABELS = ['速度', '射门', '传球', '盘带', '防守', '体能'];
const STAT_KEYS: (keyof CampusPlayer['stats'])[] = [
  'speed',
  'shooting',
  'passing',
  'dribbling',
  'defense',
  'physical'
];

export const RadarChart = ({
  campusPlayer,
  starPlayer,
  similarity,
  height = 280,
  className = ''
}: RadarChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    const campusData = STAT_KEYS.map((key) => campusPlayer.stats[key]);
    const starData = STAT_KEYS.map((key) => starPlayer.stats[key]);

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#22c55e',
        textStyle: { color: '#fff', fontSize: 12 },
        formatter: (params: { value: number[]; name: string }) => {
          const data = params.value as number[];
          const label = params.name as string;
          let html = `<div style="padding:8px;"><div style="font-weight:bold;color:#22c55e;margin-bottom:4px;">${label}</div>`;
          STAT_LABELS.forEach((text, i) => {
            html += `<div style="display:flex;justify-content:space-between;gap:16px;font-size:12px;"><span style="color:#94a3b8;">${text}</span><span style="color:#fff;">${data[i]}</span></div>`;
          });
          html += '</div>';
          return html;
        }
      },
      legend: {
        bottom: 0,
        textStyle: { color: '#cbd5e1', fontSize: 11 },
        data: [campusPlayer.name, starPlayer.name]
      },
      radar: {
        indicator: STAT_LABELS.map((name) => ({ name, max: 100 })),
        center: ['50%', '45%'],
        radius: '60%',
        axisName: {
          color: '#94a3b8',
          fontSize: 11
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(34, 197, 94, 0.02)', 'rgba(34, 197, 94, 0.06)']
          }
        },
        axisLine: {
          lineStyle: { color: 'rgba(148, 163, 184, 0.3)' }
        },
        splitLine: {
          lineStyle: { color: 'rgba(148, 163, 184, 0.2)' }
        }
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: campusData,
              name: campusPlayer.name,
              symbol: 'circle',
              symbolSize: 6,
              lineStyle: { color: '#4ade80', width: 2 },
              areaStyle: { color: 'rgba(74, 222, 128, 0.3)' },
              itemStyle: { color: '#4ade80' }
            },
            {
              value: starData,
              name: starPlayer.name,
              symbol: 'circle',
              symbolSize: 6,
              lineStyle: { color: '#f97316', width: 2 },
              areaStyle: { color: 'rgba(249, 115, 22, 0.3)' },
              itemStyle: { color: '#f97316' }
            }
          ]
        }
      ]
    };

    chart.setOption(option);

    // 弹窗/侧边栏尺寸异常时延迟 resize
    const resizeTimer = setTimeout(() => chart.resize(), 50);
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [campusPlayer, starPlayer]);

  return (
    <div className={className}>
      {similarity !== undefined && (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs text-gray-400">风格相似度</span>
          <span className="text-xs font-bold text-yellow-400">{similarity}%</span>
        </div>
      )}
      <div ref={chartRef} style={{ width: '100%', height }} />
    </div>
  );
};
