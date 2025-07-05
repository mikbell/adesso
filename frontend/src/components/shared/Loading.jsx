import React from 'react'
import { PulseLoader } from 'react-spinners'

const Loading = () => {
    return (
        <div className='flex justify-center items-center h-screen'><PulseLoader /></div>
    )
}

export default Loading