import Canvas from '@/app/components/canvas'
import { ShapeContext, ShapeProvider } from '@/contexts/shapeContext'
async function page({params}:{
  params:{
    roomid:string
  }
}) {
  const id = (await params).roomid

  
  return <ShapeProvider><Canvas roomId={id}/></ShapeProvider>
}

export default page