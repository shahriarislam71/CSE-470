import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const Announcement = () => {
    const { course } = useOutletContext();
    const [announcements, setAnnouncements] = useState(course?.announcements || []);
    const [newAnnouncement, setNewAnnouncement] = useState("");
    const [comments, setComments] = useState({});

    useEffect(() => {
        if (course?.announcements) {
            setAnnouncements(course.announcements);
        }
    }, [course]);

    const handlePostAnnouncement = () => {
        if (newAnnouncement.trim() === "") return;
        const newPost = {
            name: "You",
            photo: "https://images.pexels.com/photos/3792581/pexels-photo-3792581.jpeg?cs=srgb&dl=pexels-bertellifotografia-3792581.jpg&fm=jpg",
            date: new Date().toISOString().split("T")[0],
            message: newAnnouncement,
            comments: [],
        };
        setAnnouncements(prev => [newPost, ...prev]);
        setNewAnnouncement("");
    };

    const handleCommentChange = (index, value) => {
        setComments(prev => ({ ...prev, [index]: value }));
    };

    const handlePostComment = (index) => {
        if (!comments[index]?.trim()) return;

        setAnnouncements(prev => {
            const updatedAnnouncements = [...prev]; // Create a copy of the announcements array
            const updatedAnnouncement = { ...updatedAnnouncements[index] }; // Copy the specific announcement

            if (!updatedAnnouncement.comments) {
                updatedAnnouncement.comments = [];
            }

            updatedAnnouncement.comments = [
                ...updatedAnnouncement.comments,
                { name: "You", message: comments[index] }
            ];

            updatedAnnouncements[index] = updatedAnnouncement; // Update the announcement in the array
            return updatedAnnouncements;
        });

        setComments(prev => ({ ...prev, [index]: "" })); // Clear input field
    };

    return (
        <div className="w-5/6 h-full mx-auto p-4">
            <h2 className="text-3xl font-semibold primarytext text-center mb-10">Announcements</h2>
            <div className="mb-4 flex items-center gap-4 justify-center">
                <textarea
                    className="w-full border pt-5 pl-3 rounded text-[#012d5b] placeholder-[#012d5b] bg-white border-purple-700"
                    placeholder="Announce something to your class..."
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                />
                <button
                    className="px-4 py-2 primarybg text-white rounded"
                    onClick={handlePostAnnouncement}
                >
                    Post Announcement
                </button>
            </div>

            {announcements.length === 0 ? (
                <p className="text-gray-500">No announcements yet.</p>
            ) : (
                announcements.map((announcement, index) => (
                    <div key={index} className="border p-4 rounded mb-4 bg-white shadow-md">
                        <div className="flex items-center mb-2">
                            <img src={announcement.photo} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
                            <div>
                                <p className="font-semibold primarytext">{announcement.name}</p>
                                <p className="text-gray-500 text-sm secondarytext">{announcement.date}</p>
                            </div>
                        </div>
                        <p className="secondarytext">{announcement.message}</p>

                        <hr className="border mt-5 border-[#012d5b]" />

                        {/* Comment Section */}
                        <div className="mt-3 flex items-center gap-4 justify-center">
                            <img src={announcement.photo} alt="" className="w-10 h-10 rounded-full" />
                            <input
                                type="text"
                                className="w-full p-2 border rounded bg-white placeholder-[#012d5b] text-[#012d5b]"
                                placeholder="Add a comment..."
                                value={comments[index] || ""}
                                onChange={(e) => handleCommentChange(index, e.target.value)}
                            />

                            <div>
                                <Send
                                    onClick={() => handlePostComment(index)}
                                    size={16}
                                    className="primarytext w-7 h-7 mt-2 cursor-pointer"
                                />
                            </div>
                        </div>

                        {announcement.comments &&
                            announcement.comments.map((comment, cIndex) => (
                                <div key={cIndex} className="ml-4 mt-2 p-2 bg-gray-100 rounded">
                                    <p className="text-sm font-semibold">{comment.name}</p>
                                    <p className="text-sm">{comment.message}</p>
                                </div>
                            ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default Announcement;
