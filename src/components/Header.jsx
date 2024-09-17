import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../redux/features/authApi";
import { userLoggedOut } from "../redux/features/authSlice";
import toast from "react-hot-toast";

const Header = () => {
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const { token } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      dispatch(userLoggedOut());
      localStorage.clear();

      toast.success(response?.message || "Logout successful!");
    } catch (error) {
      toast.error(error?.data?.message || "Logout failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="header">
        <ul className="list">
          {token ? (
            <li onClick={handleLogout}>Logout</li>
          ) : (
            <>
              <Link style={{ textDecoration: "none" }} to={"/login"}>
                <li>Login</li>
              </Link>
              <Link style={{ textDecoration: "none" }} to={"/register"}>
                <li>Register</li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
