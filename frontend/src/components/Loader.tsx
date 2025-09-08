import { Loader2 } from 'lucide-react'

const Loader = () => {
  return (
    <div className='h-full w-full flex justify-center items-center'>
        <Loader2 color='green' className='h-10 w-10 animate-spin' />
    </div>
  )
}

export default Loader