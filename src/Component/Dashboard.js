import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../Common/Loding';
import MainBody from '../SubComponent/MainBody'
import CategoryList from './CategoryList'
import BudgetList from './BudgetList'
import EntryForm from './EntryForm'
import TrasactionForm from '../SubComponent/TrasactionForm'
import TransactionTable from './TransactionTable'
import Body from '../SubComponent/Body'

const Dashboard = () => {
    const profile = useSelector((state) => state.userSlice.user);
    const navigate = useNavigate();
    const location = useLocation();
    const [showPanel, setShowPanel] = useState(Body)
    const [showSidebar, setShowSidebar] = useState(false);

    const sidebarSections = [
        {
            name : "Dashboard",
            url : "/dashboard",
            component : Body,
        },
        {
            name : "Categories",
            url : "/dashboard/category",
            component : CategoryList,
        },
        {
            name : "Budgets",
            url : "/dashboard/budget",
            component : BudgetList,
        },
        {
            name : "Add Trasaction",
            url : "/dashboard/transaction",
            component : TrasactionForm,
        },
        {
            name : "Transactions",
            url : "/dashboard/transactions",
            component : TransactionTable,
        }
    ]

    const handleProfilePage = (section, extension) => {
        setShowPanel(() => section)
        navigate(extension)
        setShowSidebar(false);
    }
    
    useEffect(() => {
        const match = sidebarSections.find(item => item.url === location.pathname);
        if (match) {
            setShowPanel(() => match.component);
        } else {
            setShowPanel(() => Body); // default
            navigate('/dashboard', { replace: true });
        }
    }, [location.pathname, navigate]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".sidebar") && !e.target.closest(".menu-toggle")) {
                setShowSidebar(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        (profile?.username ? (
            <div className="dashboard-body">
                <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
                    <div className="sidebar_section">
                        <h3>{profile ? profile?.username.toUpperCase() : ''}</h3>
                    </div>
                    <div className='sidebar-links'>
                        {
                            sidebarSections.map((item) => (
                                <NavLink 
                                    to={`${item.url}`} 
                                    onClick={() => handleProfilePage(item.component, item.url)}
                                    className={({ isActive }) => (isActive ? 'active' : '')}
                                    end >
                                        {item.name}
                                </NavLink>
                            ))
                        }
                    </div>
                </div>
                <div className="sidebar-mobile">
                    <button
                    className="menu-toggle"
                    onClick={() => setShowSidebar(!showSidebar)}
                    >
                        ☰
                    </button>
                    <h4 className="mobile-title">
                        {profile ? profile?.username?.toUpperCase() : "Dashboard"}
                    </h4>
                </div>
                <div className="main-body">
                    <div className="body-section">
                        <MainBody showPanel={showPanel} />
                    </div>
                </div>
            </div>
        ) : (
            <>
                <Loading />
            </>
        ))
    )
}

export default React.memo(Dashboard)
