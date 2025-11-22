import { useState } from "react";
import { sessionData } from "./sessions"
import MySessionsTutor from "./MySessionsTutor";
import MySessionsStudent from "./MySessionsStudent";
import RegisterPage from "./RegisterPage";

export default function MySessions({isTutor, isRegister}) {
  const student = {name: "Nguyen Van B", id: 2390001};
  const tutor = {name: "Lê Minh Hào", id: 2310846};
  const [sessions, setSessions] = useState(sessionData);
  const [selectedSession, setSelectedSession] = useState(null);
  if (isRegister) {
    return (<RegisterPage
              sessions = {sessions}
              setSessions = {setSessions}
              selectedSession = {selectedSession}
              setSelectedSession = {setSelectedSession}
              user = {student}
            />);
  } else {
    if (!isTutor) {
      return (<MySessionsStudent
                sessions = {sessions}
                setSessions = {setSessions}
                selectedSession = {selectedSession}
                setSelectedSession = {setSelectedSession}
                user = {student}
              />);
    } else {
      return (<MySessionsTutor
                sessions = {sessions}
                setSessions = {setSessions}
                selectedSession = {selectedSession}
                setSelectedSession = {setSelectedSession}
                user = {tutor}
              />);
    }
  }
} 