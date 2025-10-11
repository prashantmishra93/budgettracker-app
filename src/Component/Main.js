import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { getUser } from '../redux/userSlice/getUser';
import RouterModel from '../SubComponent/RouterModel';

const Main = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUser());
    }, [])
    return (
        <div>
            <RouterModel />
        </div>
    )
}

export default Main
