import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Play, Pause, Package, Clock, CheckCircle, Settings, AlertTriangle, List, Users, ShoppingCart } from 'lucide-react';

const API_BASE = 'http://137.184.102.82:5000/api'; // Aapke Droplet ka IP

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'settings', 'logs'
  const [stats, setStats] = useState({ total: 0, pending: 0, posted: 0 });
  
  // Inventory State
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  
  // Settings State
  const [accounts, setAccounts] = useState([]);
  const [isAutomationRunning, setIsAutomationRunning] = useState(false);

  // Logs State
  const [logs, setLogs] = useState([]);

  // Users State
  const [users, setUsers] = useState([]);
  const ADMIN_TOKEN = localStorage.getItem('cs_admin_token') || '';

  useEffect(() => {
    fetchStats();
    if (activeTab === 'inventory') fetchProducts();
    if (activeTab === 'settings') fetchSettings();
    if (activeTab === 'logs') fetchLogs();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab, search]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/stats`);
      setStats(res.data.stats);
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products?search=${search}`);
      setProducts(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/settings`);
      if (res.data.settings) {
        setAccounts(res.data.settings.accounts || []);
        setIsAutomationRunning(res.data.settings.automationRunning);
      }
    } catch (err) { console.error(err); }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/logs`);
      setLogs(res.data.logs);
    } catch (err) { console.error(err); }
  };

  const toggleAutomation = async () => {
    try {
      const newState = !isAutomationRunning;
      await axios.post(`${API_BASE}/settings`, { automationRunning: newState });
      setIsAutomationRunning(newState);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      // NOTE: Pass your admin JWT token here
      const res = await axios.get(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Users fetch failed - Make sure admin token is set:', err.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Orders fetch failed:', err.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_BASE}/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
      );
      // Refresh orders
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err.message);
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Anti-Gravity Engine</h1>
            <p className="text-gray-500 mt-1">Master Control Panel for Pinterest Automation</p>
          </div>
          <button 
            onClick={toggleAutomation}
            className={`flex items-center px-6 py-3 rounded-lg font-bold text-white transition-all shadow-md ${
              isAutomationRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isAutomationRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isAutomationRunning ? 'Halt Engine' : 'Ignite Engine'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="bg-blue-100 p-4 rounded-lg mr-4"><Package className="text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Total Database</p>
              <h2 className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="bg-yellow-100 p-4 rounded-lg mr-4"><Clock className="text-yellow-600" /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Pending Bags</p>
              <h2 className="text-2xl font-bold text-gray-900">{stats.pending.toLocaleString()}</h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="bg-green-100 p-4 rounded-lg mr-4"><CheckCircle className="text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Successfully Posted</p>
              <h2 className="text-2xl font-bold text-gray-900">{stats.posted.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6 overflow-x-auto">
          <button onClick={() => setActiveTab('inventory')} className={`flex items-center px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'inventory' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}><List className="w-4 h-4 mr-2"/> Inventory</button>
          <button onClick={() => setActiveTab('orders')} className={`flex items-center px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'orders' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}><ShoppingCart className="w-4 h-4 mr-2"/> Orders</button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'settings' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}><Settings className="w-4 h-4 mr-2"/> API Settings</button>
          <button onClick={() => setActiveTab('logs')} className={`flex items-center px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'logs' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}><AlertTriangle className="w-4 h-4 mr-2"/> Error Logs</button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'users' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}><Users className="w-4 h-4 mr-2"/> Customers</button>
        </div>

        {/* Tab Content: Inventory */}
        {activeTab === 'inventory' && (
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="p-4 border-b flex items-center">
              <Search className="text-gray-400 mr-3" />
              <input type="text" placeholder="Search any bag by title..." className="w-full outline-none text-gray-700" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                  <th className="p-4 border-b">Image</th>
                  <th className="p-4 border-b">Title</th>
                  <th className="p-4 border-b">Price</th>
                  <th className="p-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-4"><img src={p['Image Src']} alt="Bag" className="w-12 h-12 object-cover rounded-md" /></td>
                    <td className="p-4 text-gray-900 font-medium">{p.Title}</td>
                    <td className="p-4">${p['Variant Price']}</td>
                    <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status === 'posted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status.toUpperCase()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white p-8 border rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Pinterest Account Rotation (7 Tokens)</h2>
            <p className="text-gray-500 mb-6">In tokens ke zariye Anti-Gravity engine khud ba khud rotate kar ke post karega.</p>
            {/* Yahan aap aage ja kar apne 7 tokens add/edit karne ke liye input fields add kar lenge */}
            <div className="bg-blue-50 text-blue-800 p-4 rounded border border-blue-200">
               Total {accounts.length} accounts configured. (You can build a form here later to push accounts via API).
            </div>
          </div>
        )}

        {/* Tab Content: Logs */}
        {activeTab === 'logs' && (
          <div className="bg-white border rounded-xl shadow-sm p-4">
            <h2 className="text-xl font-bold mb-4 px-2">Automation Activity</h2>
            {logs.length === 0 ? <p className="text-gray-500 px-2">No errors logged yet. System is healthy!</p> : (
               <ul>
                 {logs.map(log => (
                   <li key={log._id} className="p-3 border-b flex items-start text-sm">
                     <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                     <div>
                        <p className="font-semibold text-gray-900">{log.productHandle}</p>
                        <p className="text-gray-600">{log.message}</p>
                     </div>
                   </li>
                 ))}
               </ul>
            )}
          </div>
        )}

        {/* Tab Content: Users */}
        {activeTab === 'users' && (
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Registered Customers ({users.length})</h2>
              <button onClick={fetchUsers} className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Refresh</button>
            </div>
            {users.length === 0 ? (
              <p className="p-6 text-gray-500">No registered users yet. Set your admin JWT token in localStorage as 'cs_admin_token'.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                    <th className="p-4 border-b">#</th>
                    <th className="p-4 border-b">Name</th>
                    <th className="p-4 border-b">Email</th>
                    <th className="p-4 border-b">Phone</th>
                    <th className="p-4 border-b">Role</th>
                    <th className="p-4 border-b">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} className="border-b hover:bg-gray-50 text-sm">
                      <td className="p-4 text-gray-400">{i + 1}</td>
                      <td className="p-4 font-semibold text-gray-900">{u.name}</td>
                      <td className="p-4 text-gray-700">{u.email}</td>
                      <td className="p-4 text-gray-500">{u.phone || '—'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Manage Orders ({orders.length})</h2>
              <button onClick={fetchOrders} className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Refresh</button>
            </div>
            {orders.length === 0 ? (
              <p className="p-6 text-gray-500">No orders found.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                    <th className="p-4 border-b">Order ID</th>
                    <th className="p-4 border-b">Date</th>
                    <th className="p-4 border-b">Customer</th>
                    <th className="p-4 border-b">Total</th>
                    <th className="p-4 border-b">Status</th>
                    <th className="p-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b hover:bg-gray-50 text-sm">
                      <td className="p-4 font-mono text-xs text-gray-500">{o._id.substring(o._id.length - 8).toUpperCase()}</td>
                      <td className="p-4 text-gray-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-900">{o.shippingAddress?.firstName || o.user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-500">{o.shippingAddress?.email || o.user?.email}</p>
                      </td>
                      <td className="p-4 font-bold text-gray-900">${o.totalAmount.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          o.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          o.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          o.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                          o.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <select 
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-black focus:border-black block w-full p-2"
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
