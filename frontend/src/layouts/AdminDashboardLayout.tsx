import { Outlet } from "react-router-dom"

const AdminDashboardLayout = () => {
  return (
    <div>
        <div>AdminDashboardLayout</div>
        <div><Outlet/></div>
    </div>
  )
}

export default AdminDashboardLayout