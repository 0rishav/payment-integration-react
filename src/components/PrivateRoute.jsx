import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.user); 

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
