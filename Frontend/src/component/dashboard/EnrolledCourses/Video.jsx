import { useState } from "react";

const dummyVideos = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    url: "https://www.youtube.com/embed/GwIo3gDZCVQ",
    duration: "12:45",
    summary: "Learn the fundamentals of machine learning, its core concepts, and real-world applications across various industries.",
  },
  {
    id: 2,
    title: "Supervised vs Unsupervised Learning",
    url: "https://www.youtube.com/embed/gJo0uNL-5Qw",
    duration: "15:32",
    summary: "Understand the differences between supervised and unsupervised learning, with examples and use cases.",
  },
  {
    id: 3,
    title: "Neural Networks Explained",
    url: "https://www.youtube.com/embed/aircAruvnKk",
    duration: "18:27",
    summary: "Explore the structure and mechanics of neural networks, including neurons, layers, and backpropagation.",
  },
];

const Video = () => {
  const [selectedVideo, setSelectedVideo] = useState(dummyVideos[0]);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full p-4 gap-6">
      {/* Video Player Section */}
      <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
        <div className="w-full aspect-video rounded overflow-hidden mb-4">
          <iframe
            width="100%"
            height="100%"
            src={selectedVideo.url}
            title={selectedVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded"
          ></iframe>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          {selectedVideo.title}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Duration: {selectedVideo.duration}
        </p>

        {/* Summary Section */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Summary</h3>
          <p className="text-gray-700 leading-relaxed text-sm">
            {selectedVideo.summary}
          </p>
        </div>
      </div>

      {/* Video Playlist */}
      <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-4 h-fit">
        <h3 className="text-xl font-bold text-purple-600 mb-4">Lecture Playlist</h3>
        <ul className="space-y-3">
          {dummyVideos.map((video) => (
            <li
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`p-3 rounded-lg cursor-pointer border transition ${
                selectedVideo.id === video.id
                  ? "bg-purple-600 text-white border-purple-700"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium truncate w-56">{video.title}</span>
                <span className="text-sm">{video.duration}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Video;
