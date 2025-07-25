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
        className="sm:h-[400px] sm:w-[400px] h-[200px] w-[200px]"
        priority
        />
        <div>Great Things take time :)</div>
        <div className='sm:text-2xl text-xl'>Projects section, experience section, contact section and many more to be added</div>
        <div>Will be done in a couple of days</div>
    </div>
  )
}

export default Part3