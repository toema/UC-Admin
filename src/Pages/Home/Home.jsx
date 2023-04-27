import React from "react"
import Chart from "../../components/Chart/Chart"
import FeatureInfo from "../../components/FeatureInfo/FeatureInfo"
import "./Home.css"
import { UserData } from "../../DummyData"
export default function Home() {
    return (
        <div className="Home">
            
            <FeatureInfo className="FeatureDesign"/>
            <Chart data={UserData} title="User Analytics" grid dataKey="Active User"/>
        </div>
    )
}
