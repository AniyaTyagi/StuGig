import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authService } from '../../services/authService';
import { User, MapPin, GraduationCap, Briefcase, Star, Mail, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { id } = useParams();
  const currentUser = useSelector((state) => state.auth.user);
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('freelancer'); // Default fallback

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // We don't know the role beforehand, so we try fetching as freelancer first, then client
      try {
        const data = await authService.getFreelancerProfile(id);
        setProfile(data);
        setRole('freelancer');
      } catch (err) {
        // If not found or not freelancer, try client
        const data = await authService.getClientProfile(id);
        setProfile(data);
        setRole('client');
      }
    } catch (err) {
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <User size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Profile Not Found</h2>
        <p className="text-gray-500 mt-2">The user profile you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn btn-primary mt-6">Go to Homepage</Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profile._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8">
        <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"></div>
        <div className="px-8 pb-8 relative flex flex-col md:flex-row md:items-end md:gap-6 -mt-16">
          
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full border-4 border-white bg-indigo-100 text-indigo-750 font-bold text-4xl flex items-center justify-center shadow-md z-10">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              `${profile.firstName?.charAt(0)}${profile.lastName?.charAt(0)}`
            )}
          </div>

          {/* User Meta Info */}
          <div className="flex-1 mt-4 md:mt-0">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                  {profile.firstName} {profile.lastName}
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 capitalize">
                    {role}
                  </span>
                </h1>
                
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                  {profile.location && (
                    <span className="flex items-center gap-1"><MapPin size={16} /> {profile.location}</span>
                  )}
                  {profile.university && (
                    <span className="flex items-center gap-1"><GraduationCap size={16} /> {profile.university}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                {isOwnProfile ? (
                  <Link to="/settings" className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl transition duration-150">
                    Edit Profile
                  </Link>
                ) : (
                  <Link to="/messages" className="btn bg-indigo-600 hover:bg-indigo-750 text-white font-semibold px-5 py-2.5 rounded-xl transition duration-150">
                    Contact Me
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: About / Stats */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Stats Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Overview</h3>
            <div className="space-y-4">
              {role === 'freelancer' && (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Hourly Rate</span>
                    <span className="font-bold text-gray-800">${profile.hourlyRate || 15}/hr</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Rating</span>
                    <span className="flex items-center gap-1 font-bold text-yellow-500">
                      <Star size={16} className="fill-yellow-400 stroke-yellow-400" /> 
                      {profile.rating?.toFixed(1) || '5.0'} ({profile.reviews?.length || 0} reviews)
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 text-sm">Member Since</span>
                <span className="font-medium text-gray-800">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long' }) : 'June 2024'}
                </span>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          {role === 'freelancer' && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-50">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 transition text-gray-700 text-xs font-semibold rounded-lg">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No skills listed yet.</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Bio, Portfolio, Reviews */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About / Bio */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-50">
            <h3 className="text-xl font-bold text-gray-850 mb-4">About Me</h3>
            <p className="text-gray-650 leading-relaxed whitespace-pre-wrap">
              {profile.bio || "No biography provided yet. Write something unique in settings to tell people about yourself!"}
            </p>
          </div>

          {/* Portfolio (Freelancer only) */}
          {role === 'freelancer' && (
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-50">
              <h3 className="text-xl font-bold text-gray-850 mb-6">Portfolio Projects</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {profile.portfolio && profile.portfolio.length > 0 ? (
                  profile.portfolio.map((item) => (
                    <div key={item._id} className="group border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                      <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <Briefcase size={40} className="text-indigo-400 group-hover:scale-110 transition duration-300" />
                        )}
                      </div>
                      <div className="p-4 bg-white">
                        <h4 className="font-bold text-gray-800 truncate">{item.title}</h4>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-650 hover:text-indigo-800 mt-2">
                            Visit Project <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10 text-gray-400 text-sm">
                    No portfolio projects added yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews (Freelancer only) */}
          {role === 'freelancer' && (
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-50">
              <h3 className="text-xl font-bold text-gray-850 mb-6">Client Reviews</h3>
              <div className="space-y-6">
                {profile.reviews && profile.reviews.length > 0 ? (
                  profile.reviews.map((rev) => (
                    <div key={rev._id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 font-bold text-sm text-indigo-650 flex items-center justify-center">
                            {rev.reviewer?.firstName?.charAt(0)}{rev.reviewer?.lastName?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm">
                              {rev.reviewer?.firstName} {rev.reviewer?.lastName}
                            </h4>
                            <span className="text-xs text-gray-400">
                              {new Date(rev.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                          <Star size={16} className="fill-yellow-400 stroke-yellow-400" />
                          {rev.rating}
                        </div>
                      </div>
                      <p className="text-sm text-gray-650 leading-relaxed pl-13">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    No reviews received yet.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
