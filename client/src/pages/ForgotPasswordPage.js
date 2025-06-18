import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setError('');
    setFieldErrors({});
    
    // Validate email
    if (!email) {
      setError('Vui lòng nhập địa chỉ email của bạn');
      setFieldErrors({ email: true });
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ');
      setFieldErrors({ email: true });
      return;
    }
    
    // For demo purposes, just show success message
    // In a real app, you would call an API to send a password reset email
    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Khôi phục mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
          </p>
        </div>
        
        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <p className="font-bold">Đã gửi email khôi phục!</p>
            <p className="block sm:inline">Vui lòng kiểm tra email của bạn để nhận hướng dẫn đặt lại mật khẩu.</p>
            <p className="mt-2">
              <Link to="/login" className="font-medium text-green-700 underline">
                Quay lại trang đăng nhập
              </Link>
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Error message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div className="rounded-md shadow-sm -space-y-px">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="sr-only">Địa chỉ email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border 
                    ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} 
                    placeholder-gray-500 text-gray-900 focus:outline-none 
                    focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Địa chỉ email"
                />
              </div>
            </div>

            <div>
              {/* Submit button */}
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Gửi liên kết khôi phục
              </button>
            </div>
            
            {/* Back to login link */}
            <div className="text-center">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 