import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/userSlice/getUser';
import RouterModel from '../SubComponent/RouterModel';
import Loading from '../Common/Loding';

const Main = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userSlice.user);  // Get user details from Redux store
    
    useEffect(() => {
        dispatch(getUser());
    }, [])
    
  // Display a loading state until user details are fetched
    if (!user) {
        return <Loading />;
    }
    
    return (
        <div>
            <RouterModel />
        </div>
    )
}

export default Main
