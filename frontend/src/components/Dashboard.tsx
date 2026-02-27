import React, { useEffect, useState } from 'react'
import {Bar, BarChart , Pie, PieChart, ResponsiveContainer  ,Cell,Tooltip,Legend, CartesianGrid, XAxis, YAxis} from 'recharts'
import '../style/Dashboard.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate();
    type PieDataType = 
    {
     name: string
     value: number
    }
    const [piedata ,setPiedata] = useState<PieDataType[]>([])
    const[chardata,setChartdata] = useState<PieDataType[]>([])
    useEffect(() => {
    axios.get("http://127.0.0.1:8000/chart/")
      .then(res => {
        const data = res.data

        setPiedata([
          { name: "Total Books", value: data.copy },
          { name: "Available", value: data.avl_qty },
          { name: "Issued", value: data.issue },
          { name: "Returned", value: data.return }
        ])

        setChartdata([
            {name:"Total Books",value:data.copy},
            {name:"Available",value:data.avl_qty},
            { name: "Issued", value: data.issue },
            { name: "Returned", value: data.return }
        ])
         navigate("/profile", { state: { activeTab: "Dashboard" } })
      })
      
      .catch(err => console.log(err))
  }, [])
  const COLORS = ["#647bc1", "#56b693", "#e0c06d", "#e6968f"]

  return (
    <div className="dashboard-container">
        <h2 className="dashboard-title">Library Dashboard</h2>
    <div className='chart-cards'>
    <div className="chart-card">
        <h3>Books Overview</h3>
    <div className="chart-box">
    <ResponsiveContainer width="100%"  height={300}>
        <BarChart data={chardata}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis/>
            
            <Tooltip/>
           
            <Bar dataKey="value">
                {chardata.map((entry, index) => (
                    <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    />
                ))}
            </Bar>
        </BarChart>
    </ResponsiveContainer>
    </div>
    </div>

    <div className="chart-card">
         <h3>Distribution</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
             <Pie data={piedata} dataKey="value" outerRadius={150}>
              {piedata.map((entry :any,index) => (
               <Cell key={index} fill={COLORS[index % COLORS.length]} />
               ))}
           </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
      </ResponsiveContainer>
      </div>
      
    </div>
    
    </div>
  )
  }

export default Dashboard
