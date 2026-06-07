import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, Clock, CheckCircle, MessageSquare, ArrowLeft } from 'lucide-react';
import { serviceService } from '../services/serviceService';
import Loading from '../components/common/Loading';
import api from '../services/api';
import toast from 'react-hot-toast';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceDetail();
  }, [id]);

  const fetchServiceDetail = async () => {
    try {
      const response = await serviceService.getServiceById(id);
      setService(response.data || response);
    } catch (error) {
      toast.error('Failed to load service');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!user) {
      toast.error('Please login to order');
      navigate('/login');
      return;
    }
    
    // Navigate to payment page with service data
    navigate('/payment', { 
      state: { 
        service: {
          _id: service._id,
          title: service.title,
          description: service.description,
          price: service.price,
          deliveryTime: service.deliveryTime,
          freelancer: service.freelancer._id
        },
        type: 'service'
      } 
    });
  };

  if (loading) {
    return <Loading fullScreen text="Loading service details..." />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title */}
            <div>
              <h1 className="text-3xl font-medium mb-2">{service.title}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-gray-100 rounded text-gray-700">{service.category}</span>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{service.rating?.toFixed(1) || '5.0'}</span>
                  <span className="text-gray-500">({service.reviewCount || 0})</span>
                </div>
              </div>
            </div>

            {/* Freelancer Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={service.freelancer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${service.freelancer?._id}`}
                alt="freelancer"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-medium text-lg">
                  {service.freelancer?.firstName} {service.freelancer?.lastName}
                </h3>
                <p className="text-sm text-gray-600">{service.freelancer?.university || 'Student'}</p>
                <p className="text-xs text-gray-500 mt-1">{service.freelancer?.bio || 'Verified student freelancer'}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-medium mb-3">About This Service</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div>
                <h2 className="text-xl font-medium mb-3">What's Included</h2>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills/Tags */}
            {service.tags && service.tags.length > 0 && (
              <div>
                <h2 className="text-xl font-medium mb-3">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 border border-gray-200 rounded-lg p-6 space-y-4">
              
              <div className="text-center border-b pb-4">
                <div className="text-3xl font-medium mb-1">${service.price}</div>
                <div className="flex items-center justify-center gap-1 text-gray-600">
                  <Clock size={16} />
                  <span className="text-sm">{service.deliveryTime} days delivery</span>
                </div>
              </div>

              <button
                onClick={handleOrder}
                disabled={user?._id === service.freelancer?._id}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {user?._id === service.freelancer?._id ? 'Your Service' : 'Order Now'}
              </button>

              <Link
                to={`/messages?user=${service.freelancer?._id}`}
                className="w-full py-3 border border-green-600 text-green-600 hover:bg-green-50 rounded font-medium flex items-center justify-center gap-2 transition"
              >
                <MessageSquare size={18} />
                <span>Contact Seller</span>
              </Link>

              <div className="pt-4 border-t space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Time</span>
                  <span className="font-medium">{service.deliveryTime} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Orders Completed</span>
                  <span className="font-medium">{service.ordersCompleted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium">Within 2 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
