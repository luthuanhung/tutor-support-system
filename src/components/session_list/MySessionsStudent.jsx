import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbMail, TbPlus } from "react-icons/tb";
import SessionStatusStudent from "./SessionStatusStudent";
import SessionList from "./SessionList";
import Notification from "../notification/Notification";

export default function MySessionsStudent({sessions, setSessions, selectedSession, setSelectedSession}) {
  const navigate = useNavigate();
  const studentID = 2390001;
  const [showNoti, setShowNoti] = useState(false);

  return (
    <div className="max-w-4xl mx-auto bg-primary-light p-6 rounded-md shadow-sm border border-border-primary mt-10 mb-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary">My sessions</h2>
        <div className="flex gap-3">
          <button 
            className="p-2 hover:bg-primary/20 rounded-full transition text-primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/sessions/register")
            }}
          >
            <TbPlus size={26} />
          </button>
          <button 
            className="p-2 hover:bg-primary/20 rounded-full transition text-primary"
            onClick={() => {setShowNoti(true)}}
          >
            <TbMail size={26} />
          </button>
        </div>
      </div>

      {/* Session List */}
      <SessionList
        sessions={sessions}
        click={(session, type = null) => {
          setSelectedSession(session);
        }}
      />

      {/* Action */}
      <SessionStatusStudent
        studentID={studentID}
        selectedSession={selectedSession}
        onClose={() => setSelectedSession(null)}
      />

      {/* Show Notification Sidebar */}
      <Notification
        showNoti={showNoti}
        onClose={() => setShowNoti(false)}
      />
    </div>
  );
}
