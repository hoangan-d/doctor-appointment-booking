import React from 'react'
import DoctorList from './DoctorsList'

const page = () => {
    return (
        <div className='m-5 max-h-[90vh] overflow-auto'>
            <h1 className='text-lg font-medium'>All Doctors</h1>
            <DoctorList />
        </div>
    )
}

export default page