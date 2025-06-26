import React from 'react'

function IconButton(
    {icon,onClick,selected}:
    {icon:React.ReactNode,
        onClick:()=>void,
        selected?:boolean
    }
) {
  return (
    <div className={`p-2 pointer ${selected?"":"hover:bg-gray-200"} rounded ${selected?"bg-blue-100":""}`} onClick={onClick}>{icon}</div>
  )
}

export default IconButton