import React from "react";
import { Route, Routes } from 'react-router';
import NotFound from "../Component/NotFound";
import TokenAuth from "../Authenticate/TokenAuth";
import Dashboard from "../Component/Dashboard"

function RouterModel()
{
    return (
        <>
            <Routes>
                <Route path="dashboard" element={ <TokenAuth component={Dashboard} /> } />
                <Route path="dashboard/category" element={ <TokenAuth component={Dashboard} /> } />
                <Route path="dashboard/entries" element={ <TokenAuth component={Dashboard} /> } />
                <Route path="dashboard/budget" element={ <TokenAuth component={Dashboard} /> } />
                <Route path="dashboard/transaction" element={ <TokenAuth component={Dashboard} /> } />
                <Route path="dashboard/transactions" element={ <TokenAuth component={Dashboard} /> } />
                <Route path="*" element={ <NotFound /> } />
            </Routes>
        </>
    )
}

export default React.memo(RouterModel);