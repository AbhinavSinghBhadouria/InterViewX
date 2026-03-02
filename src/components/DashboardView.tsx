"use client"

import { AIIndustryInsights } from '../types'
import {  LineChart, TrendingDown, TrendingUp ,BriefcaseIcon ,Brain } from 'lucide-react';
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from '@/src/components/ui/badge'; 
import {Card,CardContent, CardDescription, CardHeader, CardTitle,} from "@/src/components/ui/card";
import { Progress } from '@/src/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis,CartesianGrid,Tooltip, ResponsiveContainer,} from "recharts";



type Props = {
  insights: AIIndustryInsights;
  lastUpdated: Date;
  nextUpdate: Date;
};

const DashboardView = ({ insights, lastUpdated, nextUpdate }: Props) => {
    //SALARY DATA
    const salaryData=insights.salaryRanges.map((range)=>({
        name:range.role ,
        min:range.min/1000 ,
        max:range.max/1000 ,
        median:range.median/1000,
    }));


  //DEMAND LEVEL
  const getDemandLevelColor=(level:string)=>{
    switch (level.toLowerCase()){
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  //MARKET OUTLOOK

 const getMarketOutLookInfo=(outlook:string)=>{
    switch(outlook.toLowerCase()){
      case "positive":
        return { icon: TrendingUp  , color:"text-green-500"};
      case "neutral":
        return {icon :LineChart ,color:"text-amber-500"};
        case "negative":
          return {icon: TrendingDown , color:"text-gray-500"};
       default:
            return { icon: LineChart, color: "text-gray-500" }
    }
  };

  const OutlookIcon=getMarketOutLookInfo(insights.marketOutlook).icon;
  const outlookColor=getMarketOutLookInfo(insights.marketOutlook).color;
   
  const lastUpdatedDate=format(new Date(lastUpdated) ," dd/MM/yyyy")

   const nextUpdateDistance = formatDistanceToNow(  new Date(nextUpdate),  { addSuffix: true } );
  return (
    <div className="space-y-6 mb-12">


      <div className="flex jusitfy-between items-center">
        <Badge variant="outline" className='p-2 text-sm' >Last updated: {lastUpdatedDate}</Badge>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className=" bg-black
  border border-blue-500/30
  shadow-[0_0_10px_rgba(0,140,255,0.35)]
  rounded-x">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-300">
              Market Outlook
            </CardTitle>
            
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

         {/* INDUSTRY GROWTH CARD */}

           <Card className=" bg-black
  border border-blue-500/30
  shadow-[0_0_10px_rgba(0,140,255,0.35)]
  rounded-x">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-300">
              Industry Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2 text-green-400" />
          </CardContent>
        </Card>  
  

         {/* DEMAND LEVEL */}
     <Card className=" bg-black
  border border-blue-500/30
  shadow-[0_0_10px_rgba(0,140,255,0.35)]
  rounded-x">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-300">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>
 
  {/* TOP SKILLS */}
             <Card className=" bg-black
  border border-blue-500/30
  shadow-[0_0_10px_rgba(0,140,255,0.35)]
  rounded-x">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="text-sm font-medium text-yellow-300">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="font-bold p-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
            </div>
    

     {/* Salary Ranges Chart */}
  <Card className=" bg-black
  border border-blue-500/30
  shadow-[0_0_10px_rgba(0,140,255,0.35)]
  rounded-x col-span-4">
    
        <CardHeader>
          <CardTitle className='text-yellow-300'>Salary Ranges by Role</CardTitle>
          <CardDescription>
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
 
              <BarChart data={salaryData}>
  <defs>
    <filter id="barGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <CartesianGrid stroke="#14532d" strokeDasharray="3 3" />

  <XAxis
    dataKey="name"
    tick={{ fill: "#22c55e" }}
    axisLine={{ stroke: "#22c55e" }}
    tickLine={{ stroke: "#22c55e" }}
  />

  <YAxis
    tick={{ fill: "#22c55e" }}
    axisLine={{ stroke: "#22c55e" }}
    tickLine={{ stroke: "#22c55e" }}
  />

  

  <Bar dataKey="min" fill="#22c55e"  />
  <Bar dataKey="median" fill="#4ade80" />
  <Bar dataKey="max" fill="#16a34a"  />
</BarChart>



            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Industry Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className=" bg-black
  border border-blue-500/30
  shadow-[0_0_10px_rgba(0,140,255,0.35)]
  rounded-x">
          <CardHeader>
            <CardTitle className="text-yellow-300">Key Industry Trends</CardTitle>
            <CardDescription>
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span className="font-bold">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>


          <Card className=" bg-black
  border border-blue-500/30
  shadow-[0_0_10px_rgba(0,140,255,0.35)]
  rounded-x">
          <CardHeader>
            <CardTitle className="text-yellow-300">Recommended Skills</CardTitle>
            <CardDescription>Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="p-1 font-bold bg-muted/50">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardView;
