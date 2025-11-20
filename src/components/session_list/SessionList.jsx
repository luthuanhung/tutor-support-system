import { TbSettings2, TbTrashX } from "react-icons/tb";
import formatSessionTime from "./formatSessionTime";

export default function SessionList({sessions, click, isTutor = false, user = null, isRegister = false, search}) {

  // Filtered sessions
  const filteredSessions = isRegister? sessions.filter((session) => {
    if (user) {
      return (!session.students.some(student => student.studentID === user.id)) && (search? (session.courseID.includes(search) || session.tutor.includes(search)) : true);
    }
    return true; // fallback, show all if no filter
  }) : sessions.filter((session) => {
    if (user) {
      return (session.tutorID === user.id) || (session.students.some(student => student.studentID === user.id));
    }
    return true; // fallback, show all if no filter
  })

  return (
    <div className="space-y-3">
      {filteredSessions.map((session, index) => (
        <div
          key={index}
          onClick={() => {click(session);}}
          className="bg-white border border-border-secondary rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex justify-between">
            <div>
              {/* Session Title */}
              <h3 className="text-primary font-semibold text-lg">
                {session.title}
              </h3>

              {/* Course info */}
              <p className="text-text-primary text-sm mb-1">
                {session.courseName} ({session.courseID})_{session.tutor}
              </p>

              {/* Time + State */}
              <p className="text-black text-sm mb-1">
                {formatSessionTime(session.date, session.startTime, session.endTime)} - <span className="italic">{session.state}</span>
              </p>

              {/* Location */}
              <p className="text-black text-sm">{session.location}</p>
            </div>

            {/* Right-side */}
            {isTutor? (
              <div className="flex gap-2 h-fit">
                <button 
                  className="p-1 hover:bg-primary/20 rounded-full transition text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    click(session, "edit");
                  }}
                >
                  <TbSettings2 size={20} />
                </button>
                <button 
                  className="p-1 hover:bg-primary/20 rounded-full transition text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    click(session, "cancel");
                  }}
                >
                  <TbTrashX size={20} />
                </button>
              </div>
            ) : (
              <div className="flex h-fit text-text-primary justify-end">
                {session.students.length}/{session.maxStudent}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
