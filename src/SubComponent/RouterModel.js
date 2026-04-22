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
                <Route index element={<TokenAuth component={Dashboard} />} />
                <Route path="category" element={ <TokenAuth component={Dashboard} /> } />
                <Route path="entries" element={ <TokenAuth component={Dashboard} /> } />
                <Route path="budget" element={ <TokenAuth component={Dashboard} /> } />
                <Route path="transaction" element={ <TokenAuth component={Dashboard} /> } />
                <Route path="transactions" element={ <TokenAuth component={Dashboard} /> } />
                <Route path="*" element={ <NotFound /> } />
            </Routes>
        </>
    )
}

export default React.memo(RouterModel);
