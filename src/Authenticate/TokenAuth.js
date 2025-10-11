import { Navigate } from 'react-router-dom';
const TokenAuth = ({ component: Component }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />
    }
    return <Component />;
};
export default TokenAuth;