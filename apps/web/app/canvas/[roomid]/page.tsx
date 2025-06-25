import Canvas from '@/app/components/canvas'
async function page({params}:{
  params:{
    roomid:string
  }
}) {
  const id = (await params).roomid

  
  return <Canvas roomId={id}/>
}

export default page