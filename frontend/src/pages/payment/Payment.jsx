import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Wallet, CreditCard, ArrowUpCircle, ArrowDownCircle, 
  DollarSign, TrendingUp, Clock, CheckCircle, XCircle,
  Plus, History
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('wallet'); // wallet, add-funds, transactions
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [addAmount, setAddAmount] = useState('');

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await api.get('/payments/balance');
      const data = response.data?.wallet || response.data || {};
      setWalletData(data);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/payments');
      const data = response.data || response;
      setTransactions(data.payments || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount < 10) {
      toast.error('Minimum amount is $10');
      return;
    }

    setLoading(true);
    
    try {
      // Create Razorpay order
      const orderResponse = await api.post('/payments/create-razorpay-order', {
        amount: amount * 100 // Razorpay expects amount in paise/cents
      });

      const order = orderResponse.data?.order || orderResponse.data;

      // Load Razorpay SDK
      const options = {
        key: 'rzp_test_xxxxxxxxxxxxxx', // Replace with your key
        amount: order.amount,
        currency: 'USD',
        name: 'StuGig',
        description: 'Add Funds to Wallet',
        order_id: order.id,
        handler: async function (response) {
          // Verify payment
          try {
            await api.post('/payments/add-funds', {
              amount,
              paymentMethod: 'razorpay',
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });
            
            toast.success(`$${amount} added to wallet successfully!`);
            setAddAmount('');
            fetchWalletData();
            fetchTransactions();
            setActiveTab('wallet');
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.firstName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#1e40af'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        toast.error('Payment failed. Please try again.');
      });
      razorpay.open();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFundsSimple = async () => {
    const amount = parseFloat(addAmount);
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await api.post('/payments/add-funds', {
        amount,
        paymentMethod: 'test'
      });
      
      toast.success(`$${amount} added to wallet successfully!`);
      setAddAmount('');
      fetchWalletData();
      fetchTransactions();
      setActiveTab('wallet');
    } catch (error) {
      toast.error('Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'released': return 'text-green-600 bg-green-100 dark:bg-green-950/40';
      case 'held': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950/40';
      case 'refunded': return 'text-blue-600 bg-blue-100 dark:bg-blue-950/40';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-950/40';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-950/40';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'released': return <CheckCircle size={16} />;
      case 'held': return <Clock size={16} />;
      case 'refunded': return <ArrowDownCircle size={16} />;
      default: return <XCircle size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Payments & Wallet</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Manage your funds and view transaction history
          </p>
        </div>

        {/* Wallet Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Current Balance</p>
              <p className="text-2xl font-black mt-1">${walletData?.balance?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Wallet size={24} />
            </div>
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Total Earnings</p>
              <p className="text-2xl font-black mt-1">${walletData?.earnings?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="p-2.5 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Total Spending</p>
              <p className="text-2xl font-black mt-1">${walletData?.spending?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="p-2.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl">
              <ArrowUpCircle size={24} />
            </div>
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Transactions</p>
              <p className="text-2xl font-black mt-1">{transactions.length}</p>
            </div>
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-xl">
              <History size={24} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 mb-6">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === 'wallet'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400'
            }`}
          >
            Wallet Overview
          </button>
          <button
            onClick={() => setActiveTab('add-funds')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === 'add-funds'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400'
            }`}
          >
            Add Funds
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === 'transactions'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400'
            }`}
          >
            Transaction History
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-primary-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('add-funds')}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Funds to Wallet
                </button>
                <button
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                  disabled
                >
                  <ArrowDownCircle size={18} />
                  Withdraw Funds (Coming Soon)
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold mb-4">How Escrow Works</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-lg h-fit">
                    1
                  </div>
                  <p className="text-slate-600 dark:text-zinc-400">
                    Client pays upfront - funds are held securely in escrow
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-lg h-fit">
                    2
                  </div>
                  <p className="text-slate-600 dark:text-zinc-400">
                    Freelancer completes the work and delivers
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-lg h-fit">
                    3
                  </div>
                  <p className="text-slate-600 dark:text-zinc-400">
                    Payment released to freelancer (85% after 15% commission)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add-funds' && (
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-bold mb-6">Add Funds to Your Wallet</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="100.00"
                    min="10"
                    step="10"
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
                  Minimum amount: $10
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {[10, 50, 100, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAddAmount(amount.toString())}
                    className="py-2 px-4 border-2 border-slate-200 dark:border-zinc-800 rounded-lg hover:border-primary-600 dark:hover:border-primary-400 transition font-semibold text-sm"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddFundsSimple}
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CreditCard size={18} />
                  {loading ? 'Processing...' : 'Add Funds (Test Mode)'}
                </button>
                
                <div className="text-center text-xs text-slate-500 dark:text-zinc-400">
                  <p>💳 In test mode - funds will be added instantly</p>
                  <p className="mt-1">Production: Razorpay integration available</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="card">
            <h3 className="text-lg font-bold mb-6">Transaction History</h3>
            
            {transactions.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {transactions.map((transaction) => {
                  const isReceived = transaction.payee?._id === user?.id || transaction.payee?._id === user?._id;
                  
                  return (
                    <div key={transaction._id} className="py-4 flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${
                          isReceived 
                            ? 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                        }`}>
                          {isReceived ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm">
                            {transaction.job?.title || 'Payment Transaction'}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                            {isReceived ? 'From' : 'To'}: {
                              isReceived 
                                ? `${transaction.payer?.firstName} ${transaction.payer?.lastName}`
                                : `${transaction.payee?.firstName} ${transaction.payee?.lastName}`
                            }
                          </p>
                          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                            {new Date(transaction.createdAt).toLocaleDateString()} at {new Date(transaction.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`font-bold text-lg ${
                          isReceived ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {isReceived ? '+' : '-'}${transaction.amount?.toFixed(2)}
                        </p>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mt-2 ${
                          getStatusColor(transaction.status)
                        }`}>
                          {getStatusIcon(transaction.status)}
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="mx-auto text-slate-300 dark:text-zinc-700 mb-4" size={48} />
                <p className="text-slate-500 dark:text-zinc-400">No transactions yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Load Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
};

export default Payment;
