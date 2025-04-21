import { useContext, useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { Authcontext } from '../../context/AuthProvider';

const Banner = () => {
    const { users } = useContext(Authcontext);
    const [profileImage, setProfileImage] = useState('');
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Dynamic date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });

    useEffect(() => {
        if (users?.photoURL) {
            // For Google images, use highest quality version available
            let imageUrl = users.photoURL;
            
            if (imageUrl.includes('googleusercontent.com')) {
                // Get the highest quality version (up to 2000px)
                imageUrl = imageUrl.replace(/(=s\d+)?$/, '=s2000-c');
            }

            // Create a new image to test quality
            const testImage = new Image();
            testImage.src = imageUrl;
            
            testImage.onload = () => {
                // If image loads successfully with good dimensions
                if (testImage.naturalWidth >= 500) {
                    setProfileImage(imageUrl);
                } else {
                    // Fallback to original URL if quality is poor
                    setProfileImage(users.photoURL);
                }
            };
            
            testImage.onerror = () => {
                // Fallback to original URL if modified URL fails
                setProfileImage(users.photoURL);
            };
        } else {
            // Use high-quality default image
            setProfileImage("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80");
        }
    }, [users?.photoURL]);

    return (
        <div className='ms-5 mt-8 rounded-lg flex justify-between background'>
            <div className=''>
                <p className='pl-4 pt-9 text-white text-lg'>{formattedDate}</p>
                <p className='pl-4 pt-14 mt-4 text-white text-2xl font-semibold'>
                    Welcome Back, {users?.displayName || 'Student'}
                </p>
                <p className='pl-4 text-white'>Always Stay updated in your Student Portal</p>
            </div>
            <div className='flex justify-end'>
                {!imageLoaded && (
                    <div className="w-[459px] h-[302px] bg-gray-200 rounded-lg flex items-center justify-center">
                        <FaUser className="text-5xl text-gray-500" />
                    </div>
                )}
                <img 
                    className={`w-[459px] h-[302px] object-cover rounded-lg ${!imageLoaded ? 'hidden' : ''}`}
                    src={profileImage}
                    alt="Student Profile"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                        e.target.onerror = null;
                        // Try original URL if enhanced version fails
                        if (users?.photoURL && e.target.src !== users.photoURL) {
                            e.target.src = users.photoURL;
                        } else {
                            // Final fallback to high-quality default
                            e.target.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80";
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default Banner;