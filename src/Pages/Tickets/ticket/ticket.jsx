import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosClient from '../../../Axios-client'
import "./tickets.css"

export default function Ticket() {
  const [Data, setData] = useState({ 'data': 'not found' })

  const param = useParams()
  // console.log(param)

  const getTicket = async () => {
    const getinfo = await axiosClient.get(`/Tickets/${param.id}`).then((res) => {
      setData(res.data.ok)
      console.log(Data)
    }
    )
  }
  useEffect(() => {
    getTicket()

  }, [])
  return (<>
    <div className="main-Ticket">
      <div className="Ticket-NavBar">

      </div>
      <div>{Object.keys(Data).map((KeyName, i) => {
        return (
          <div className={`mapping data` + i} key={i}>
            <div className="Collec-Title">
              {KeyName}</div>
            {Data[KeyName] ? Object.keys(Data[KeyName]).map((values, ind) => {
              return ( <div className='main-profile'>
                <div className="main-table">
                  <div className="mapping-actions" key={ind}>{
                    values}</div></div>
                <div className="attributesForEveryMapping">
                  {Data[KeyName][values] ? Object.keys(Data[KeyName][values]).map((value, inde) => {
                    return (<>
                      <div className="listValue">{value}</div>
                    </>)
                  }) : <></>}
                </div>
              </div>
              )
            }) : <div className='eligibilty'>not found</div>}
          </div>
        )
      })}</div>
    </div></>)
}
