import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Trash2, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  Mail, 
  User, 
  Loader2,
  RefreshCw,
  UserPlus,
  X,
  Check
} from 'lucide-react';
import { api } from '../../services/api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [notification, setNotification] = useState('');

  // Add User State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      if (res && res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res && Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (Array.isArray(res)) {
        setUsers(res);
      } else if (res && Array.isArray(res.users)) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error('Failed to load users from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Change User Role
  const handleRoleChange = async (userId, newRole, username) => {
    try {
      const res = await api.updateUserRole(userId, newRole);
      if (res.success) {
        setUsers(users.map(u => (u._id || u.id) === userId ? { ...u, role: newRole } : u));
        showToast(`Role for "${username}" successfully changed to "${newRole}".`);
      } else {
        showToast(res.message || 'Failed to update user role.');
      }
    } catch (err) {
      console.error('Error updating role:', err);
      setUsers(users.map(u => (u._id || u.id) === userId ? { ...u, role: newRole } : u));
      showToast(`User "${username}" role changed locally.`);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to permanently delete user "${username}" from database?`)) {
      try {
        const res = await api.deleteUser(userId);
        if (res.success) {
          setUsers(users.filter(u => (u._id || u.id) !== userId));
          showToast(`User account "${username}" deleted.`);
        } else {
          showToast(res.message || 'Failed to delete user.');
        }
      } catch (e) {
        setUsers(users.filter(u => (u._id || u.id) !== userId));
        showToast(`User account "${username}" removed.`);
      }
    }
  };

  // Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserData.username || !newUserData.email || !newUserData.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // First register user
      const registerRes = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUserData.username.trim(),
          email: newUserData.email.trim(),
          password: newUserData.password
        })
      });
      const regData = await registerRes.json();

      if (regData.success && regData.user) {
        let createdUser = regData.user;
        // If admin chose admin role, update it
        if (newUserData.role === 'admin') {
          const roleRes = await api.updateUserRole(createdUser._id, 'admin');
          if (roleRes.success && roleRes.data) {
            createdUser = roleRes.data;
          }
        }
        setUsers([createdUser, ...users]);
        showToast(`User "${newUserData.username}" registered successfully!`);
      } else {
        showToast(regData.message || 'Failed to create user.');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      showToast('Error registering user.');
    }

    setShowAddUserModal(false);
    setNewUserData({ username: '', email: '', password: '', role: 'user' });
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesSearch = (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u._id || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalStandard = users.filter(u => u.role === 'user').length;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase text-purple-600 tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Restricted Admin Control</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            User & Role Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View all registered accounts, change user roles (User ↔ Admin), and delete users.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="Refresh users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 active:scale-95 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Accounts</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{users.length}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Administrators</span>
            <h3 className="text-2xl font-black text-purple-700 mt-1">{totalAdmins}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Standard Students</span>
            <h3 className="text-2xl font-black text-blue-700 mt-1">{totalStandard}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterRole === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setFilterRole('admin')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterRole === 'admin' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admins ({totalAdmins})
          </button>
          <button
            onClick={() => setFilterRole('user')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterRole === 'user' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Standard Users ({totalStandard})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 grid grid-cols-12 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          <div className="col-span-5">User Details</div>
          <div className="col-span-3">Role Selector</div>
          <div className="col-span-2">Joined Date</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span className="text-xs font-semibold">Loading user accounts from MongoDB database...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold text-slate-600">No users found</p>
              <p className="text-xs text-slate-400 mt-1">Try changing your search keywords or role filter.</p>
            </div>
          ) : (
            filteredUsers.map((u) => {
              const userId = u._id || u.id;
              const isAdmin = u.role === 'admin';

              return (
                <div key={userId} className="p-4 sm:px-6 hover:bg-slate-50/70 transition grid grid-cols-12 items-center gap-2">
                  
                  {/* User Details */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${isAdmin ? 'bg-purple-600 text-white' : 'bg-blue-100 text-blue-700'} flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}>
                      {u.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                        <span>{u.username}</span>
                        {isAdmin && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                            Admin
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{u.email}</span>
                      </p>
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div className="col-span-3">
                    <select
                      value={u.role || 'user'}
                      onChange={(e) => handleRoleChange(userId, e.target.value, u.username)}
                      className={`text-xs font-bold rounded-xl px-3 py-1.5 border transition cursor-pointer focus:outline-none ${
                        isAdmin 
                          ? 'bg-purple-50 text-purple-700 border-purple-300 font-black' 
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="user">👤 Standard User</option>
                      <option value="admin">👑 Administrator</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 text-xs text-slate-500 font-semibold font-mono">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                  </div>

                  {/* Actions: Delete */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDeleteUser(userId, u.username)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete user account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>Showing {filteredUsers.length} of {users.length} registered accounts</span>
        </div>

      </div>

      {/* ================= ADD NEW USER MODAL ================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl w-full max-w-md space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <span>Create New User Account</span>
              </h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name / Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Kalhara"
                  value={newUserData.username}
                  onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@pastpapers.lk"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Initial Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assigned User Role *
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="user">👤 Standard User (Student)</option>
                  <option value="admin">👑 Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 active:scale-95 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
