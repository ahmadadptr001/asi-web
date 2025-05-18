import Navigasi from "../components/Navigasi";
import SidebarDashboard from "../components/SidebarDashboard";
import Error404 from "./Error404";

const Dashboard = () => {
        
        return (
                <>
                        { localStorage.getItem('status_login_fake')  === 'true' ? (
                                <>
                                        <Navigasi />
                                        <SidebarDashboard />
                                </>

                        ) : (
                                <>
                                        <Error404 />
                                </>
                        )}
                </>
        )
}
export default Dashboard;