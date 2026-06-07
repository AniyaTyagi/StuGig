import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { login, reset } from '../../redux/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess && user) {
      toast.success('Login successful!');
      const role = user.role;
      if (role === 'admin') navigate('/dashboard/admin');
      else if (role === 'recruiter' || role === 'startup') navigate('/dashboard/client');
      else navigate('/dashboard/freelancer');
    }
    if (isError) {
      toast.error(message || 'Login failed');
    }
    dispatch(reset());
  }, [user, isSuccess, isError, message, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 py-12 px-4 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Log in to your StuGig account</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Email</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Password</label>
            <input
              type="password"
              className="input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-zinc-400">
            Don't have an account? <Link to="/signup" className="text-primary-600 dark:text-primary-400 hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
