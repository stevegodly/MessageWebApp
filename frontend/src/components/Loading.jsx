const Spinner = () => {
    return (
      <div className='fixed top-0 left-0 flex justify-center items-center w-full h-full bg-gray-200 opacity-75 z-50'>
        <div className='border-t-4 border-b-4 animate-ping w-32 h-32 rounded-full bg-sky-500'></div>
      </div>
      )
  }    
  
  export default Spinner