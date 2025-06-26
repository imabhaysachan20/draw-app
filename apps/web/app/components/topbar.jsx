import React, { act, useContext } from 'react'
import { ShapeContext } from '@/contexts/shapeContext'

import IconButton from './iconButton'
import { BoxIcon, Circle, LineSquiggleIcon, PencilLine } from 'lucide-react'

function Topbar() {
  const context = useContext(ShapeContext);
  if (!context) {
    return
  }
  const active = context?.shape
  const setActive = context?.setShape
  return (
    <div className='fixed flex top-8 left-1/2 shadow-lg rounded gap-x-2 p-1 -translate-x-1/2 -translate-y-1/2'>
        <IconButton selected={active=="rect"} icon={<BoxIcon/>} onClick={()=>{setActive("rect")}}/>
        <IconButton selected={active=="circle"} icon={<Circle/>} onClick={()=>{setActive("circle")}}/>
        <IconButton selected={active=="line"} icon={<LineSquiggleIcon/>} onClick={()=>{setActive("line")}}/>
    </div>
  )
}

export default Topbar