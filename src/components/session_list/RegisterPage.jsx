import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TbSearch } from "react-icons/tb";
import Modal from "./Modal";
import SessionList from "./SessionList";

export default function RegisterPage({sessions, setSessions, selectedSession, setSelectedSession}) {
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const [search, setSearch] = useState("");

  return (
    <div
      className="w-full h-screen"
      onDoubleClick={() => navigate("/sessions")}
    >
      <div 
        className="max-w-4xl mx-auto bg-primary-light p-6 rounded-md shadow-sm border border-border-primary mt-10 mb-10 relative"
        onDoubleClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border border-text-primary rounded-xl">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tutor’s name or course ID"
            className="w-full p-2 focus:outline-none text-2xl text-text-primary"
          />
          <button className="p-2 hover:bg-text-primary/20 rounded-full transition text-text-primary">
            <TbSearch size={26} />
          </button>
        </div>

        {/* Session List */}
        <SessionList
          sessions={sessions}
          click={(session, type = "register") => {
            setType(type);
            setSelectedSession(session);
          }}
          setSessions = {setSessions}
          setSelectedSession = {setSelectedSession}
        />
        {/* Action */}
        <Modal
          type={type}
          selectedSession={selectedSession}
          onClose={(type = null, session = null) => {
            setType(type);
            setSelectedSession(session);
          }}
        />
      </div>
    </div>
  );
}
