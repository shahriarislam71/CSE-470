import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FiUpload, FiPlay, FiTrash2, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const CourseVideos = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [videosByWeek, setVideosByWeek] = useState({});
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const videoInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [previewVideo, setPreviewVideo] = useState(null);

  // Fetch course details and lecture videos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseRes = await fetch(`http://localhost:5000/courses/${courseId}`);
        const courseData = await courseRes.json();
        setCourseDetails(courseData);

        // Fetch lecture videos
        await loadLectureVideos(courseData.courseCode, courseData.email);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load lecture videos',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    fetchData();
  }, [courseId]);

  const loadLectureVideos = async (courseCode, email) => {
    try {
      const response = await fetch(
        `http://localhost:5000/course-videos?courseCode=${courseCode}&email=${email}`
      );
      const data = await response.json();
      
      if (data.videosByWeek) {
        setVideosByWeek(data.videosByWeek);
        // Expand first week by default if none are expanded
        const weeks = Object.keys(data.videosByWeek);
        if (weeks.length > 0 && !Object.values(expandedWeeks).some(v => v)) {
          setExpandedWeeks(prev => ({
            ...prev,
            [weeks[0]]: true
          }));
        }
      } else {
        setVideosByWeek({});
      }
    } catch (error) {
      console.error('Error loading lecture videos:', error);
    }
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!videoInputRef.current.files[0]) {
      Swal.fire({
        title: 'No Video Selected',
        text: 'Please select a video file to upload',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('video', videoInputRef.current.files[0]);
      formData.append('courseCode', courseDetails.courseCode);
      formData.append('email', courseDetails.email);
      formData.append('week', selectedWeek);
      formData.append('title', title);
      formData.append('description', description);

      const response = await fetch('http://localhost:5000/course-videos', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Lecture video uploaded successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setTitle('');
        setDescription('');
        videoInputRef.current.value = '';
        await loadLectureVideos(courseDetails.courseCode, courseDetails.email);
      } else {
        throw new Error('Failed to upload lecture video');
      }
    } catch (error) {
      console.error('Error uploading lecture video:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to upload lecture video',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `http://localhost:5000/course-videos/${videoId}?courseCode=${courseDetails.courseCode}&email=${courseDetails.email}`,
          { method: 'DELETE' }
        );

        if (response.ok) {
          Swal.fire(
            'Deleted!',
            'Your lecture video has been deleted.',
            'success'
          );
          await loadLectureVideos(courseDetails.courseCode, courseDetails.email);
          setPreviewVideo(null);
        } else {
          throw new Error('Failed to delete lecture video');
        }
      }
    } catch (error) {
      console.error('Error deleting lecture video:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete lecture video',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const toggleWeek = (week) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {courseDetails?.courseName || 'Loading...'} - Lecture Videos
          </h1>
          <p className="text-gray-600">
            Manage and upload video lectures for your students
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-medium ${activeTab === 'upload' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Upload New Videos
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 font-medium ${activeTab === 'manage' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Manage Existing Videos
          </button>
        </div>

        {/* Upload Form */}
        <AnimatePresence>
          {activeTab === 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload New Lecture Video</h2>
              <form onSubmit={handleVideoUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Week</label>
                    <select
                      value={selectedWeek}
                      onChange={(e) => setSelectedWeek(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    >
                      {[...Array(16).keys()].map(i => (
                        <option key={i+1} value={i+1}>Week {i+1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Video title"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Brief description of the video content"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="video-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                        >
                          <span>Upload a video</span>
                          <input
                            id="video-upload"
                            name="video-upload"
                            type="file"
                            className="sr-only"
                            ref={videoInputRef}
                            accept="video/*"
                            required
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        MP4, MOV, AVI up to 100MB
                      </p>
                      {videoInputRef.current?.files[0] && (
                        <p className="text-sm text-gray-900 mt-2">
                          Selected: {videoInputRef.current.files[0].name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`flex items-center px-6 py-2 rounded-lg text-white font-medium ${
                      isUploading
                        ? 'bg-purple-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                    } transition-colors`}
                  >
                    {isUploading ? (
                      'Uploading...'
                    ) : (
                      <>
                        <FiUpload className="mr-2" />
                        Upload Video
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Videos List */}
        <AnimatePresence>
          {activeTab === 'manage' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Lecture Videos</h2>
              
              {Object.keys(videosByWeek).length === 0 ? (
                <div className="text-center py-12">
                  <FiPlay className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No lecture videos</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by uploading some lecture videos.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                    >
                      <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                      Upload Videos
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {previewVideo && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-lg w-full max-w-4xl overflow-hidden">
                        <div className="p-4 flex justify-between items-center bg-gray-50">
                          <h3 className="text-lg font-medium">{previewVideo.title}</h3>
                          <button 
                            onClick={() => setPreviewVideo(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            Close
                          </button>
                        </div>
                        <div className="aspect-w-16 aspect-h-9 bg-black">
                          <video 
                            controls 
                            className="w-full h-full"
                            src={previewVideo.videoUrl}
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-gray-700">{previewVideo.description}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            Uploaded: {new Date(previewVideo.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {Object.entries(videosByWeek).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).map(([week, videos]) => (
                    <div key={week} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleWeek(week)}
                        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900">Week {week}</h3>
                        {expandedWeeks[week] ? (
                          <FiChevronUp className="text-gray-500" />
                        ) : (
                          <FiChevronDown className="text-gray-500" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {expandedWeeks[week] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="divide-y divide-gray-200">
                              {videos.map((video, index) => (
                                <div key={index} className="p-4 flex items-start">
                                  <button
                                    onClick={() => setPreviewVideo(video)}
                                    className="flex-shrink-0 relative group"
                                  >
                                    <div className="w-32 h-20 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                                      <FiPlay className="h-8 w-8 text-white group-hover:text-purple-300 transition-colors" />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                                      {formatDuration(video.duration)}
                                    </div>
                                  </button>
                                  <div className="ml-3 flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {video.title || 'Untitled Video'}
                                    </p>
                                    {video.description && (
                                      <p className="text-sm text-gray-500 mt-1">
                                        {video.description}
                                      </p>
                                    )}
                                    <div className="mt-2 flex space-x-3">
                                      <span className="text-xs text-gray-500">
                                        Uploaded: {new Date(video.uploadedAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                                    <button
                                      onClick={() => setPreviewVideo(video)}
                                      className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                                      title="Preview"
                                    >
                                      <FiPlay />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteVideo(video.videoId)}
                                      className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                                      title="Delete"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseVideos;