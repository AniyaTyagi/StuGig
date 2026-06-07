import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { register, reset } from '../../redux/slices/authSlice';

const Signup = () => {
  const [searchParams] = useSearchParams();
  
  const getRoleFromParam = () => {
    const param = searchParams.get('role');
    if (param === 'freelancer' || param === 'student') return 'student';
    if (param === 'client' || param === 'startup') return 'startup';
    if (param === 'recruiter') return 'recruiter';
    return 'student'; // Default
  };

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    role: getRoleFromParam(),
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess && user) {
      toast.success('Account created successfully!');
      const role = user.role;
      if (role === 'admin') navigate('/dashboard/admin');
      else if (role === 'recruiter' || role === 'startup') navigate('/dashboard/client');
      else navigate('/dashboard/freelancer');
    }
    if (isError) {
      toast.error(message || 'Registration failed');
    }
    dispatch(reset());
  }, [user, isSuccess, isError, message, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 py-12 px-4 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Join StuGig student & startup network today</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Full Name</label>
            <input
              type="text"
              className="input"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>

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
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">I want to join as a</label>
            <select
              className="input"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="student">Student (Find Gigs & Internships)</option>
              <option value="startup">Startup Company (Hire Students)</option>
              <option value="recruiter">Professional Recruiter (Hire Students)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-zinc-400">
            Already have an account? <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
