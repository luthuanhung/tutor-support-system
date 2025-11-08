import React from 'react';
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CourseSection from '../../components/course/CourseSection';
import FileDetails from './FileDetails';
import {
    FaPlayCircle,      // For the "General" section (might need adjustment if a different icon is preferred)
    FaChevronDown,    // For expanded sections
    FaChevronRight,   // For collapsed sections (not shown but good for toggle)
    FaTh,             // Grid icon for "Reorder sections"
    FaCog,            // Settings icon
    FaTimes,          // Close/delete icon
    FaFileAlt,        // Document icon for chapters
    FaLock,           // Lock icon
    FaEye,            // Eye icon for visibility
    FaLink,           // Link icon
    FaFolderOpen      // Folder icon for implementation
} from 'react-icons/fa';

import { useState } from 'react';

// ----- SAMPLE -----
const courseTitle = "Software Engineering";
const courseID = "C03001";
const lecturer = "Tran Truong Tan Phat";
const className = "CC04 - CC05";

const sectionSamples = [
    {
        "sectionId": "sec_01",
        "title": "Module 1: Version Control with Git",
        "items": [
            {
                "id": "item_101",
                "title": "Introduction to Git",
                "type": "mp4", // Changed from "mp4"
                "description": ["Core concepts: repositories, commits, and branches."],
                "isLocked": false,
                "isVisible": true,
                "size": "102.5 MB",
                "lastModified": "2025-07-25 10:30 AM",
                "totalPages": null, // Not a document
                "previewUrl": "https://i.imgur.com/bWSIKk8.png", // Placeholder
                "comments": [
                    { 
                        "id": 1, 
                        "author": "Jane Doe", 
                        "timestamp": "1 day ago", 
                        "text": "Great intro!", 
                        "isOnline": true 
                    }
                ]
            },
            {
                "id": "item_102",
                "title": "Git Cheat Sheet",
                "type": "PDF", // Changed from "pdf"
                "description": ["Common commands for branching, merging, and rebasing."],
                "isLocked": false,
                "isVisible": true,
                "size": "2.5 MB",
                "lastModified": "2025-07-24 09:15 AM",
                "totalPages": 5,
                "previewUrl": "https://i.imgur.com/bWSIKk8.png", // Placeholder
                "comments": [
                    { 
                        "id": 1, 
                        "author": "John Doe", 
                        "timestamp": "2 hours ago", 
                        "text": "This has some nice notes!", 
                        "isOnline": true 
                    },
                    { 
                        "id": 2, 
                        "author": "Jane Doe", 
                        "timestamp": "1 day ago", 
                        "text": "Love the lessons!", 
                        "isOnline": false 
                    }
                ]
            },
            {
                "id": "item_103",
                "title": "Project: 'MyFirstRepo'",
                "type": "Folder", // Changed from "folder"
                "description": ["Practice repository for completing the module exercises."],
                "isLocked": true,
                "isVisible": true,
                "size": "1.8 MB",
                "lastModified": "2025-07-26 11:00 AM",
                "totalPages": null,
                "previewUrl": null, // Folders might not have a preview
                "comments": []
            }
        ]
    },
    {
        "sectionId": "sec_02",
        "title": "Module 2: Data Structures & Algorithms",
        "items": [
            {
                "id": "item_201",
                "title": "Lecture 2.1: Arrays vs. Linked Lists",
                "type": "mp4",
                "description": [
                    "Understanding time complexity.",
                    "Big O notation for common operations."
                ],
                "isLocked": false,
                "isVisible": true,
                "size": "240.1 MB",
                "lastModified": "2025-07-28 14:00 PM",
                "totalPages": null,
                "previewUrl": "https://i.imgur.com/bWSIKk8.png", // Placeholder
                "comments": []
            },
            {
                "id": "item_202",
                "title": "Whiteboard: 'Binary Tree Traversal'",
                "type": "png", // Changed from "png"
                "description": ["Diagram showing Pre-order, In-order, and Post-order traversal."],
                "isLocked": false,
                "isVisible": false,
                "size": "0.5 MB",
                "lastModified": "2025-07-28 15:30 PM",
                "totalPages": null,
                "previewUrl": "https://i.imgur.com/bWSIKk8.png", // Placeholder
                "comments": []
            }
        ]
    }
];

    


export default function CourseStructure() {
    // State to manage section expansion (for interactivity)
    const [selectedItem, setSelectedItem] = useState(null);

    // 3. Create handlers to open and close the modal
    const handleViewDetails = (item) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    return (
        <div>
            <Header/>
            <div className="font-sans min-h-screen p-8 text-gray-800">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">{courseTitle} ({courseID})</h1>
                        <p className="text-lg font-medium text-gray-700">{lecturer} [{className}]</p>
                    </div>
                    <button className="px-5 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition duration-200">
                        Create Section
                    </button>
                </div>
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    {sectionSamples.map((section) => (
                        <CourseSection key={section.sectionId} title={section.title} items={section.items} onViewDetails={handleViewDetails}/>
                    ))}
                </div>
            </div>
            <Footer/>
            {selectedItem && (
                <FileDetails 
                    file={selectedItem} 
                    comments={selectedItem.comments || []}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
