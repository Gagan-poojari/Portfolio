import Image from 'next/image'
import React from 'react'

const Part3 = () => {
  return (
    <div className='sm:h-screen sm:m-0 m-10 flex flex-col justify-center items-center'>
        <Image 
        src="/under_construction.svg"
        alt="under construction"
        width={200}
        height={200}
        className="sm:h-[500px] sm:w-[500px] h-[200px] w-[200px]"
        priority
        />
        <div>Great Things take time :)</div>
    </div>
  )
}

export default Part3