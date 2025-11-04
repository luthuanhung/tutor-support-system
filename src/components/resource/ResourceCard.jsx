import {
    FaRegCommentDots,
    FaSearch,
    FaFilter,
    FaFolderPlus,
    FaBars,
    FaTh,
    FaUpload,
    FaFolder,
    FaFilePdf,
    FaFileVideo,
    FaFileImage,
    FaEllipsisV,
    FaEye,
    FaDownload,
    FaShareAlt,
    FaFile 
} from 'react-icons/fa';

import { useState } from 'react'

const ResourceCard = ({ type, size, size_unit, title }) => {
    const lowerType = type.toLowerCase();
    let Icon;
    let iconColor;
    switch(lowerType) {
        case "folder":
            Icon = FaFolder;
            iconColor = "text-primary";
            break;
        case "pdf":
            Icon = FaFilePdf;
            iconColor = "text-orange-500";
            break;
        // Group common video types
        case "mp4":
        case "mov":
        case "avi":
            Icon = FaFileVideo;
            iconColor = "text-purple-500";
            break;
        // Group common image types
        case "jpg":
        case "jpeg":
        case "png":
        case "svg":
        case "gif":
            Icon = FaFileImage;
            iconColor = "text-green-500";
            break;
        default:
            Icon = FaFile;
            iconColor = "text-gray-500";
            break;
    }

    const [dropActive, setActive] = useState(false);

    return (
        <div className="relative group border border-gray-200 rounded-lg p-5 select-none cursor-pointer 
                        transition-transform duration-200 
                        hover:scale-105
                        hover:border-gray-500
                        hover:z-10 "
        >
            {/* Action icons */}
            <div className="absolute hidden top-5 right-5 group-hover:flex items-center gap-3 text-gray-500">
                <FaEye className="w-5 h-5 cursor-pointer hover:text-gray-800" />
                <FaDownload className="w-5 h-5 cursor-pointer hover:text-gray-800" />
                <FaShareAlt className="w-5 h-5 cursor-pointer hover:text-gray-800" />
                <FaEllipsisV className="w-5 h-5 cursor-pointer hover:text-gray-800" onClick={() => setActive(!dropActive)} />
            </div>
            {/* Dropdown Menu (Statically shown as in the image) */}
            {dropActive && 
                <div 
                    className="absolute top-12 right-5 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-10"
                    onMouseLeave={() => setActive(false)}
                >
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Download</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Rename</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Move</a>
                    <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Details</a>
                </div>
            }

            <Icon className={`w-12 h-12 ${iconColor} mb-4`} />
            <h3 className="font-semibold text-sm truncate mb-1">{title}</h3>
            {lowerType === "folder" ? 
                <p className="text-xs text-gray-500">Folder</p> :
                <p className="text-xs text-gray-500">{size} {size_unit}</p>
            }
        </div>
    )
}
export default ResourceCard