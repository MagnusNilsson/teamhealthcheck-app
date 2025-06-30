import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface RadarChartProps {
  data: {
    psychological_safety_avg: number
    dependability_avg: number
    structure_clarity_avg: number
    meaning_impact_avg: number
  }
}

const RadarChart = ({ data }: RadarChartProps) => {
  const chartData = {
    labels: [
      'Psychological Safety',
      'Dependability',
      'Structure & Clarity',
      'Meaning & Impact'
    ],
    datasets: [
      {
        label: 'Team Health Scores',
        data: [
          data.psychological_safety_avg,
          data.dependability_avg,
          data.structure_clarity_avg,
          data.meaning_impact_avg
        ],
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(37, 99, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(37, 99, 235, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          font: {
            size: 12
          }
        },
        pointLabels: {
          font: {
            size: 14,
            weight: '600' as const
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed.r.toFixed(1)}/5`
          }
        }
      }
    }
  }

  return (
    <div className="radar-chart-container">
      <Radar data={chartData} options={options} />
    </div>
  )
}

export default RadarChart