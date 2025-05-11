import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await API.get('/api/profile', { withCredentials: true });
        
        if (response.status === 200) {
          setProfile(response.data);
        } else {
          setError('Failed to fetch profile');
        }
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
          Your Profile
        </h1>

        {loading && <Loader className="animate-spin w-6 h-6 mx-auto text-indigo-600 mb-4" />}

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {profile && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Profile Details</h2>
            <div className="mb-4">
              <img
                src={profile.profile_picture || '/idefault-avatar.png'}
                alt="Profile"
                className="w-auto h-auto rounded-full mx-auto mb-4"
              />
              <p className="text-gray-800 font-medium">Name: {profile.name}</p>
              <p className="text-gray-800 font-medium">Email: {profile.email}</p>
    
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
