import React from 'react'
import WorkspaceProvider from './Provider'

const Workspacelayout = ({children}) => {
  return (
   <WorkspaceProvider>
    {children}
   </WorkspaceProvider>
  )
}

export default Workspacelayout