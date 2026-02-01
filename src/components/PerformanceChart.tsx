"use client"
import React, { useEffect } from 'react'
import { useState } from 'react';
import {format} from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer,} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
const PerformanceChart = ({assessments}:any) => {

    const [chartData , setChartData]=useState([]);

    useEffect(()=>{
        if(assessments){
            const formattedDate= assessments.map((assessment:any)=>({
              date:format(new Date(assessment.createdAt) , "dd MMM") ,
              score:assessment.quizScore ,
            }))
     setChartData(formattedDate);
        }
    } ,[assessments]);

   

  return (
    <div>
      <Card className="bg-black mt-6 border border-blue-500/30 shadow-[0_0_15px_rgba(0,140,255,0.35)] rounded-xl mt-2 mb-2" >
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl text-center text-blue-300">
          Performance Trend
        </CardTitle>
        <CardDescription>Your quiz scores over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-md">
                        <p className="text-sm font-medium">
                          Score: {payload[0].value}%
                        </p>
                        <p className="text-xs ">
                          {payload[0].payload.date}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="natural"
                dataKey="score"
                stroke="rgba(59,130,246,0.9)"
                    style={{
                  filter: "drop-shadow(0 0 6px rgba(59,130,246,0.6))",
                 }}
                strokeWidth={3}
                 connectNulls
                dot={{ r: 4, fill: "#22c55e" }}  
                activeDot={{ r: 6, fill: "#16a34a" }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export default PerformanceChart
