import { Navigate } from 'react-router-dom';

const TokenAuth = ({ component: Component }) => {
    const token = localStorage.getItem('token');
    return token ? <Component /> : <Navigate to="/" replace />;
};

export default TokenAuth;