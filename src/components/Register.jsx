import { useState } from 'react';
import { useRegisterUserMutation } from "../redux/features/authApi";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader'; 

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const validate = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Username is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    } else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      errors.password = 'Password must contain both letters and numbers';
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
      const response = await registerUser({ name, email, password }).unwrap();
      
      if (response.success) {
        localStorage.setItem("activation_token", response.activationToken);
        toast.success(response.message || 'Registration successful! Check your email to activate your account.');
        navigate("/verification");
      } else {
        toast.error(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      {isLoading && <Loader />} {/* Show Loader while loading */}

      <div className="modal-overlay">
        <div className="card">
          <div className="dialog">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
              <label>
                Username:
                <input
                  type="text"
                  placeholder="Enter username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </label>
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
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
