import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FiUpload, FiFile, FiImage, FiTrash2, FiDownload, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const CourseNotes = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [notesByWeek, setNotesByWeek] = useState({});
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('upload');

  // Fetch course details and lecture notes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseRes = await fetch(`http://localhost:5000/courses/${courseId}`);
        const courseData = await courseRes.json();
        setCourseDetails(courseData);

        // Fetch lecture notes
        await loadLectureNotes(courseData.courseCode, courseData.email);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load lecture notes',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    fetchData();
  }, [courseId]);

  const loadLectureNotes = async (courseCode, email) => {
    try {
      const response = await fetch(
        `http://localhost:5000/lecture-notes?courseCode=${courseCode}&email=${email}`
      );
      const data = await response.json();
      
      if (data.notesByWeek) {
        setNotesByWeek(data.notesByWeek);
        // Expand first week by default
        if (Object.keys(data.notesByWeek).length > 0 && !expandedWeeks[Object.keys(data.notesByWeek)[0]]) {
          setExpandedWeeks(prev => ({
            ...prev,
            [Object.keys(data.notesByWeek)[0]]: true
          }));
        }
      } else {
        setNotesByWeek({});
      }
    } catch (error) {
      console.error('Error loading lecture notes:', error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!fileInputRef.current.files[0]) {
      Swal.fire({
        title: 'No File Selected',
        text: 'Please select a file to upload',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', fileInputRef.current.files[0]);
      formData.append('courseCode', courseDetails.courseCode);
      formData.append('email', courseDetails.email);
      formData.append('week', selectedWeek);
      formData.append('title', title);
      formData.append('description', description);

      const response = await fetch('http://localhost:5000/lecture-notes', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Lecture note uploaded successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setTitle('');
        setDescription('');
        fileInputRef.current.value = '';
        await loadLectureNotes(courseDetails.courseCode, courseDetails.email);
      } else {
        throw new Error('Failed to upload lecture note');
      }
    } catch (error) {
      console.error('Error uploading lecture note:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to upload lecture note',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteNote = async (fileId) => {
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
        const response = await fetch(`http://localhost:5000/lecture-notes/${fileId}?courseCode=${courseDetails.courseCode}&email=${courseDetails.email}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          Swal.fire(
            'Deleted!',
            'Your lecture note has been deleted.',
            'success'
          );
          await loadLectureNotes(courseDetails.courseCode, courseDetails.email);
        } else {
          throw new Error('Failed to delete lecture note');
        }
      }
    } catch (error) {
      console.error('Error deleting lecture note:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete lecture note',
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

  const getFileIcon = (contentType) => {
    if (contentType.startsWith('image/')) {
      return <FiImage className="text-blue-500" />;
    } else if (contentType === 'application/pdf') {
      return <FiFile className="text-red-500" />;
    }
    return <FiFile className="text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {courseDetails?.courseName || 'Loading...'} - Lecture Notes
          </h1>
          <p className="text-gray-600">
            Manage and upload lecture materials for your students
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-medium ${activeTab === 'upload' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Upload New Notes
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 font-medium ${activeTab === 'manage' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Manage Existing Notes
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload New Lecture Notes</h2>
              <form onSubmit={handleFileUpload} className="space-y-4">
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
                      placeholder="Lecture title"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Brief description of the lecture notes"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF or Image)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            ref={fileInputRef}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, PNG up to 10MB
                      </p>
                      {fileInputRef.current?.files[0] && (
                        <p className="text-sm text-gray-900 mt-2">
                          Selected: {fileInputRef.current.files[0].name}
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
                        Upload Notes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes List */}
        <AnimatePresence>
          {activeTab === 'manage' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Lecture Notes</h2>
              
              {Object.keys(notesByWeek).length === 0 ? (
                <div className="text-center py-12">
                  <FiFile className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No lecture notes</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by uploading some lecture notes.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                    >
                      <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                      Upload Notes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(notesByWeek).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).map(([week, notes]) => (
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
                              {notes.map((note, index) => (
                                <div key={index} className="p-4 flex items-start">
                                  <div className="flex-shrink-0 pt-1">
                                    {getFileIcon(note.contentType)}
                                  </div>
                                  <div className="ml-3 flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {note.title || 'Untitled Document'}
                                    </p>
                                    {note.description && (
                                      <p className="text-sm text-gray-500 mt-1">
                                        {note.description}
                                      </p>
                                    )}
                                    <div className="mt-2 flex space-x-3">
                                      <span className="text-xs text-gray-500">
                                        Uploaded: {new Date(note.uploadedAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                                    <a
                                      href={note.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                                      title="Download"
                                    >
                                      <FiDownload />
                                    </a>
                                    <button
                                      onClick={() => handleDeleteNote(note.fileId)}
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

export default CourseNotes;