import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/userSlice/getUser';
import RouterModel from '../SubComponent/RouterModel';
import Loading from '../Common/Loding';
import { Navigate } from 'react-router-dom';
import { url } from '../helper/api_helper';

const Main = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userSlice.user);  // Get user details from Redux store
    const loading = useSelector((state) => state.userSlice.loading);
    
    const token = localStorage.getItem(url.USER_TOKEN);

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch])

    
    // 🔥 STEP 1: Block access if no token
    if (!token) {
        return <Navigate to="/" replace />;
    }
    
  // Display a loading state until user details are fetched
    if (!user && loading) {
        return <Loading />;
    }
    
    return (
        <div>
            <RouterModel />
        </div>
    )
}

export default Main
