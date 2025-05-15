import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddStudent = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:5000/students', { email });
      toast.success('Student added successfully');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-purple-600 py-4 px-6">
          <h2 className="text-xl font-bold text-white">Add New Student</h2>
          <p className="text-purple-200 text-sm">Enter student email to register</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Student Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="student@example.com"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                loading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
              } transition-colors`}
            >
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;