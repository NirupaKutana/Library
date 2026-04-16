import { useEffect, useState } from 'react'
import {
  Bar, BarChart, Pie, PieChart,
  ResponsiveContainer, Cell, Tooltip, Legend,
  CartesianGrid, XAxis, YAxis, Area, AreaChart
} from 'recharts'
import '../style/Dashboard.css'
import API from '../Api/axios'
import { useNavigate } from 'react-router-dom'

/* ── icon helper ── */
const Ico = ({ d, size = 20, stroke = "currentColor" }: { d: string; size?: number; stroke?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

/* ── live clock ── */
const LiveClock = () => {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="live-clock">
      <div className="clock-time">
        {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div className="clock-date">
        {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </div>
  )
}

/* ── custom tooltip ── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tt-label">{label}</p>
        <p className="tt-val">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD COMPONENT  — all original logic UNCHANGED
══════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const navigate = useNavigate()

  type PieDataType = { name: string; value: number }

  const [bookData,  setBookData]  = useState<PieDataType[]>([])
  const [piedata,   setPiedata]   = useState<PieDataType[]>([])
  const [chardata,  setChartdata] = useState<PieDataType[]>([])

  /* ── original API call — UNCHANGED ── */
  useEffect(() => {
    API.get("/chart/")
      .then(res => {
        const data = res.data
        setBookData([
          { name: "Total Books",    value: data.copy    },
          { name: "Available Book", value: data.avl_qty },
          { name: "Issue Book",     value: data.issue   },
          { name: "Return Book",    value: data.return  },
        ])
        setPiedata([
          { name: "Total Books", value: data.copy    },
          { name: "Available",   value: data.avl_qty },
          { name: "Issued",      value: data.issue   },
          { name: "Returned",    value: data.return  },
        ])
        setChartdata([
          { name: "Total",     value: data.copy    },
          { name: "Available", value: data.avl_qty },
          { name: "Issued",    value: data.issue   },
          { name: "Returned",  value: data.return  },
        ])
        navigate("/profile", { state: { activeTab: "Dashboard" } })
      })
      .catch(err => console.log(err))
  }, [])

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"]

  /* ── derived insights from API data (not static) ── */
  const total     = bookData.find(d => d.name === "Total Books")?.value    ?? 0
  const available = bookData.find(d => d.name === "Available Book")?.value ?? 0
  const issued    = bookData.find(d => d.name === "Issue Book")?.value     ?? 0
  const returned  = bookData.find(d => d.name === "Return Book")?.value    ?? 0

  const availPct  = total ? Math.round((available / total) * 100) : 0
  const issuePct  = total ? Math.round((issued    / total) * 100) : 0
  const returnPct = issued + returned > 0 ? Math.round((returned / (issued + returned)) * 100) : 0

  /* ── stat card config ── */
  const statConfig = [
    {
      icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
      color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)",
    },
    {
      icon: "M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
      color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)",
    },
    {
      icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1z",
      color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)",
    },
    {
      icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
      color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)",
    },
  ]

  return (
    <div className="db-wrap">

      {/* ── row 1: live clock + greeting ── */}
      <div className="db-header-row">
        <div className="db-greeting">
          {/* <h2 className="db-title">Library Dashboard</h2> */}
          <p className="db-sub">Real-time overview of your library system</p>
        </div>
        <LiveClock />
      </div>

      {/* ── row 2: 4 stat cards ── */}
      <div className="stat-row">
        {bookData.map((d, i) => (
          <div className="stat-card" key={i}
            style={{ "--accent": statConfig[i].color, "--accent-bg": statConfig[i].bg, "--accent-border": statConfig[i].border } as any}>
            <div className="stat-icon-wrap">
              <Ico d={statConfig[i].icon} size={20} stroke={statConfig[i].color} />
            </div>
            <div className="stat-info">
              <span className="stat-label">{d.name}</span>
              <span className="stat-value">{d.value}</span>
            </div>
            <div className="stat-bar-bg">
              <div className="stat-bar-fill"
                style={{ width: total ? `${Math.round((d.value / total) * 100)}%` : '0%' }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── row 3: derived insight pills (computed from API data) ── */}
      {total > 0 && (
        <div className="insight-row">
          <div className="insight-pill" style={{ "--ic": "#10b981" } as any}>
            <span className="insight-dot" />
            <span className="insight-text">
              <strong>{availPct}%</strong> books are currently available
            </span>
          </div>
          <div className="insight-pill" style={{ "--ic": "#f59e0b" } as any}>
            <span className="insight-dot" />
            <span className="insight-text">
              <strong>{issuePct}%</strong> of total stock is available
            </span>
          </div>
          <div className="insight-pill" style={{ "--ic": "#6366f1" } as any}>
            <span className="insight-dot" />
            <span className="insight-text">
              <strong>{returnPct}%</strong> return rate on issued books
            </span>
          </div>
          <div className="insight-pill" style={{ "--ic": "#ef4444" } as any}>
            <span className="insight-dot" />
            <span className="insight-text">
              <strong>{issued}</strong> book{issued !== 1 ? "s" : ""} currently with members
            </span>
          </div>
        </div>
      )}

      {/* ── row 4: charts ── */}
      <div className="chart-grid">

        {/* Bar chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <Ico d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 1 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" size={16} />
              <span>Books Overview</span>
            </div>
            <span className="chart-badge">Bar</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chardata} barSize={42}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chardata.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <Ico d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z" size={16} />
              <span>Distribution</span>
            </div>
            <span className="chart-badge">Pie</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={piedata} dataKey="value" outerRadius={110} innerRadius={50}
                paddingAngle={3} strokeWidth={0}>
                {piedata.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ fontSize: 12, color: "#64748b" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Area trend — derived from same chardata, shows relative trend */}
        <div className="chart-card chart-card-wide">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <Ico d="M22 12h-4l-3 9L9 3l-3 9H2" size={16} />
              <span>Stock Trend Overview</span>
            </div>
            <span className="chart-badge">Area</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chardata}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5}
                fill="url(#areaGrad)" dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#6366f1" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}

export default Dashboard