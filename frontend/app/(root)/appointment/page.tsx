'use client'
import { AppContext } from '@/app/context/AppContext'
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const Appointment = () => {
  // const { docId } = useParams()
  // const { doctors } = useContext(AppContext)
  // const [docInfo, setDocInfo] = useState(null)

  // const fetchDocInfo = async () => {
  //   const docInfor = doctors.find(doc => doc._id === docId)
  //   setDocInfo(docInfo)
  //   console.log(docInfo)
  // }
  // useEffect(() => {
  //   fetchDocInfo()
  // }, [doctors, docId])

  return (
    <div>Appointment</div>
  )
}

export default Appointment