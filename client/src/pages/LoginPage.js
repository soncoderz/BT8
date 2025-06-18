import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // If already authenticated, redirect to home page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setFieldErrors({});
    
    // Validate if fields are empty
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      
      const newFieldErrors = {};
      if (!username) newFieldErrors.username = true;
      if (!password) newFieldErrors.password = true;
      
      setFieldErrors(newFieldErrors);
      return;
    }
    
    // Validate username for unicode characters
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(username)) {
      setError('Tên đăng nhập không được chứa ký tự unicode');
      setFieldErrors({ username: true });
      return;
    }
    
    // Validate password for unicode characters
    const passwordRegex = /^[a-zA-Z0-9_.\-!@#$%^&*()[\]{}|;:,.<>?]+$/;
    if (!passwordRegex.test(password)) {
      setError('Mật khẩu không được chứa ký tự unicode');
      setFieldErrors({ password: true });
      return;
    }
    
    // Try to login
    const result = await login(username, password, rememberMe);
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message || 'Thông tin đăng nhập không chính xác');
      if (result.field) {
        setFieldErrors({ [result.field]: true });
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập tài khoản
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="sr-only">Tên đăng nhập</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border 
                  ${fieldErrors.username ? 'border-red-500' : 'border-gray-300'} 
                  placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none 
                  focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Tên đăng nhập"
              />
            </div>
            
            {/* Password field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border 
                  ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'} 
                  placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none 
                  focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Mật khẩu"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Remember me checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Nhớ tài khoản
              </label>
            </div>
            
            {/* Forgot password link */}
            <div className="text-sm">
              <Link to="/auth/forgotpassword" className="font-medium text-blue-600 hover:text-blue-500">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div>
            {/* Login button */}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đăng nhập
            </button>
          </div>
          
          {/* Register link */}
          <div className="text-center">
            <span className="text-sm text-gray-600">Chưa có tài khoản? </span>
            <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              Đăng ký
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 