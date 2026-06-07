import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">StuGig</h3>
            <p className="text-gray-400">Student freelance marketplace connecting talent with opportunity.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Freelancers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/jobs">Find Jobs</Link></li>
              <li><Link to="/services">Browse Services</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/jobs/new">Post a Job</Link></li>
              <li><Link to="/services">Hire Freelancers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 StuGig. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
