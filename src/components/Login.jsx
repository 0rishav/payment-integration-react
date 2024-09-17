import { useState } from 'react';
import { useLoginMutation } from "../redux/features/authApi"; 
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginMutation();

  const validate = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await loginUser({ email, password }).unwrap();
      console.log(response);

      if (response.success) {
        if (response.accessToken) {
          localStorage.setItem('token', response.accessToken);
        }

        toast.success(response.message || 'Login successful!');
        navigate("/subscription"); 
      } else {
        toast.error(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div>
      {isLoading && <Loader />} 
      <div className="modal-overlay">
        <div className="card modal">
          <div className="dialog">
            <h2>Login</h2>
            <form className="register-form" onSubmit={handleSubmit}>
              <label>
                Email:
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </label>
              <label>
                Password:
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
              </label>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
