import React, { useState, useMemo, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { 
    FaSearch, 
    FaCalendarAlt, 
    FaClipboardList, 
    FaTrashAlt, 
    FaCheck,
    FaTimes,
    FaCheckCircle 
} from "react-icons/fa";

// --- (Mock data and helper functions remain the same) ---
const tutorsList = ["John Do", "Jane Smith", "Alex Tran", "Mai Nguyen"];
const sampleCourses = [
    { courseId: "CC001", name: "Software Engineering I", seats: 12, available: true },
    { courseId: "CC002", name: "Software Project Management", seats: 0, available: false },
    { courseId: "CC003", name: "Software Verification", seats: 4, available: true },
    { courseId: "CC004", name: "Software Architecture", seats: 2, available: true },
    { courseId: "CC005", name: "Advanced Software Engineering", seats: 1, available: true },
    { courseId: "CC006", name: "Software Security", seats: 5, available: true },
    { courseId: "CC007", name: "Database Systems", seats: 6, available: true },
    { courseId: "CC008", name: "Operating Systems", seats: 3, available: true },
    { courseId: "CC009", name: "Computer Networks", seats: 0, available: false },
];
const defaultRegistrationPeriod = {
    from: { date: "21/10/2025", time: "10:00" },
    to: { date: "28/10/2025", time: "15:00" },
};
const makeRegistrationItem = (course, index) => {
    const classId = `CL${String(index + 1).padStart(2, "0")}`;
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const rooms = ["B4_302", "B6_203", "A1_105", "C2_210"];
    const periods = ["2-3", "5-6", "1-2", "3-4"];
    return {
        id: Date.now() + Math.random(),
        courseId: course.courseId,
        courseName: course.name,
        classId,
        registration: `${Math.min(10, Math.max(1, Math.round(Math.random() * 9)))}/10`,
        assignedTutor: tutorsList[index % tutorsList.length],
        day: days[index % days.length],
        period: periods[index % periods.length],
        room: rooms[index % rooms.length],
        campus: `B_${(index % 3) + 1}`,
        weeks: "12345678",
    };
};
const getClassesForCourseAndTutor = (course, tutor) => {
    const base = course.courseId.replace(/\D/g, "") || 1;
    const count = 2 + (parseInt(base, 10) % 2); // 2 or 3 classes
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const rooms = ["B4_302", "B6_203", "A1_105", "C2_210", "D1_101"];
    const periods = ["2-3", "5-6", "1-2", "3-4", "6-7"];
    return Array.from({ length: count }).map((_, i) => {
        const idx = (parseInt(base, 10) + i + tutor.length) % 5;
        return {
            classId: `CL${String(i + 1).padStart(2, "0")}`,
            assignedTutor: tutor,
            day: days[idx % days.length],
            period: periods[idx % periods.length],
            room: rooms[idx % rooms.length],
            campus: `B_${(i % 3) + 1}`,
            weeks: "12345678",
            registration: `${Math.min(10, 2 + (i % 9))}/10`,
        };
    });
};
// --- (End of mock data) ---


const RegisterCourse = () => {
    const [search, setSearch] = useState("");
    const [courses, setCourses] = useState(sampleCourses.map(c => ({ ...c, selected: false })));
    const [pending, setPending] = useState([]);
    const [period] = useState(defaultRegistrationPeriod);

    // edit modal state
    const [editingReg, setEditingReg] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [tutorClasses, setTutorClasses] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");

    // --- (Hooks and handlers remain the same) ---
    useEffect(() => {
        if (!successMsg) return;
        const t = setTimeout(() => setSuccessMsg(""), 3000);
        return () => clearTimeout(t);
    }, [successMsg]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return courses.filter(c => c.courseId.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    }, [search, courses]);

    const handleSelect = (course, idx) => {
        if (!course.available || course.selected) return;
        const item = makeRegistrationItem(course, idx);
        setPending(prev => [item, ...prev]);
        setCourses(prev => prev.map(c => c.courseId === course.courseId ? { ...c, selected: true } : c));
    };

    const handleRemove = (id) => {
        const removed = pending.find(p => p.id === id);
        if (removed) {
            setCourses(prev => prev.map(c => c.courseId === removed.courseId ? { ...c, selected: false } : c));
        }
        setPending(prev => prev.filter(p => p.id !== id));
    };

    const openEditModal = (reg) => {
        setEditingReg(reg);
        setModalOpen(true);
        setSelectedTutor(null);
        setTutorClasses([]);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingReg(null);
        setSelectedTutor(null);
        setTutorClasses([]);
    };

    const handleSelectTutor = (tutor) => {
        if (!editingReg) return;
        setSelectedTutor(tutor);
        const course = sampleCourses.find(c => c.courseId === editingReg.courseId) || { courseId: editingReg.courseId, name: editingReg.courseName };
        const classes = getClassesForCourseAndTutor(course, tutor);
        setTutorClasses(classes);
    };

    const handleChangeClass = (cls) => {
        if (!editingReg) return;
        setPending(prev =>
            prev.map(p => p.id === editingReg.id
                ? {
                    ...p,
                    classId: cls.classId,
                    assignedTutor: cls.assignedTutor,
                    day: cls.day,
                    period: cls.period,
                    room: cls.room,
                    campus: cls.campus,
                    weeks: cls.weeks,
                }
                : p
            )
        );
        setSuccessMsg("Class changed successfully.");
        closeModal();
    };
    // --- (End of handlers) ---

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="max-w-7xl mx-auto p-8 font-sans">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Course Registration</h2>

                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-3">
                        <FaCheckCircle className="text-green-600" />
                        <span className="font-medium">{successMsg}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Left: Registration period */}
                    <div className="col-span-1 bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Registration Period</h3>
                        <div className="grid gap-4">
                            <div className="flex justify-between items-center p-4 rounded-lg border border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-500">From</p>
                                    <p className="text-base font-semibold text-gray-800">{period.from.date}</p>
                                    <p className="text-sm text-gray-500">{period.from.time}</p>
                                </div>
                                <FaCalendarAlt className="text-primary" size={20} />
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-lg border border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-500">To</p>
                                    <p className="text-base font-semibold text-gray-800">{period.to.date}</p>
                                    <p className="text-sm text-gray-500">{period.to.time}</p>
                                </div>
                                <FaCalendarAlt className="text-primary" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Course search and list */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="flex gap-4 mb-5">
                                <div className="flex-1 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FaSearch />
                                    </span>
                                    <input
                                        className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                                        placeholder="Search by course ID or name..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <button className="px-5 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition duration-200">
                                    Search
                                </button>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200">
                            <div className="grid grid-cols-12 text-xs bg-gray-50/70 p-4 font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="col-span-3">CourseID</div>
                                <div className="col-span-6">Course Name</div>
                                <div className="col-span-3 text-right">Action</div>
                            </div>
                            <div className="max-h-60 overflow-auto">
                                {filtered.map((c, idx) => (
                                    <div key={c.courseId} className="grid grid-cols-12 items-center p-4 border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
                                        <div className="col-span-3 text-sm font-medium text-primary">{c.courseId}</div>
                                        <div className="col-span-6 text-sm text-gray-700">{c.name}</div>
                                        <div className="col-span-3 flex justify-end gap-2">
                                            {!c.available ? (
                                                <span className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-500 rounded-full cursor-not-allowed">
                                                    Not available
                                                </span>
                                            ) : c.selected ? (
                                                <span className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-full flex items-center gap-1.5 border border-green-200">
                                                    <FaCheck /> Selected
                                                </span>
                                            ) : (
                                                <button
                                                    className="px-4 py-1.5 text-xs font-semibold bg-primary text-white rounded-full hover:opacity-90 transition"
                                                    onClick={() => handleSelect(c, idx)}
                                                >
                                                    Select
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {filtered.length === 0 && (
                                    <div className="p-6 text-center text-gray-500">No courses matched "{search}"</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending registrations */}
                <section className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-light text-primary rounded-lg bg-blue-100 text-blue-600">
                                <FaClipboardList size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">Registration List</h4>
                                <p className="text-sm text-gray-500">Pending registrations</p>
                            </div>
                        </div>
                        <div className="text-sm font-medium text-gray-600">Total: {pending.length}</div>
                    </div>

                    <div className="space-y-4">
                        {pending.map((reg, i) => (
                            <div key={reg.id} className="border border-gray-200 rounded-lg p-5">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-4 flex-grow">
                                        <div className="text-lg font-bold text-primary w-8 pt-1">{i + 1}.</div>
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 mb-1">
                                                <a className="text-lg font-semibold text-gray-800 hover:text-primary transition">{reg.classId} - {reg.courseName}</a>
                                                <div className="text-xs bg-gray-100 px-2.5 py-1 rounded-full font-medium text-gray-700">{reg.registration}</div>
                                            </div>

                                            {/* --- MODIFICATION 1: Details Grid --- */}
                                            {/* This grid is responsive: 2, 3, then 6 cols */}
                                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-3 gap-x-6 text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500">ClassID</span>
                                                    <span className="font-medium text-gray-700">{reg.classId}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500">Assigned Tutor</span>
                                                    <span className="font-medium text-gray-700">{reg.assignedTutor}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500">Day</span>
                                                    <span className="font-medium text-gray-700">{reg.day}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500">Period</span>
                                                    <span className="font-medium text-gray-700">{reg.period}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500">Room</span>
                                                    <span className="font-medium text-gray-700">{reg.room}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500">Campus</span>
                                                    <span className="font-medium text-gray-700">{reg.campus}</span>
                                                </div>
                                            </div>
                                            {/* --- END MODIFICATION 1 --- */}
                                            
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                                        {/* --- MODIFICATION 2: Edit Button --- */}
                                        <button
                                            className="px-4 py-1.5 text-xs font-medium bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                                            onClick={() => openEditModal(reg)}
                                        >
                                            Edit
                                        </button>
                                        {/* --- END MODIFICATION 2 --- */}
                                        <button
                                            className="px-4 py-1.5 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-full flex items-center gap-2 transition"
                                            onClick={() => handleRemove(reg.id)}
                                        >
                                            <FaTrashAlt /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {pending.length === 0 && (
                            <div className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-200 rounded-lg">
                                No pending registrations. Select a course to add it to the list.
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Edit modal */}
            {modalOpen && editingReg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 rounded-xl shadow-xl overflow-hidden border border-gray-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50/70">
                            <div>
                                <div className="text-sm text-gray-600">Edit class for</div>
                                <div className="text-lg font-semibold text-gray-900">{editingReg.courseId} - {editingReg.courseName}</div>
                            </div>
                            <button
                                className="text-gray-400 hover:text-gray-600 transition"
                                onClick={closeModal}
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Tutors list */}
                            <div className="md:col-span-1 bg-gray-50/70 rounded-lg p-4 border border-gray-200">
                                <div className="text-sm font-semibold text-gray-600 mb-3">Available Tutors</div>
                                <div className="space-y-2">
                                    {tutorsList.map(t => (
                                        <button
                                            key={t}
                                            className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                                                selectedTutor === t
                                                    ? "bg-primary text-white border-primary shadow-sm"
                                                    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                                            }`}
                                            onClick={() => handleSelectTutor(t)}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Classes for selected tutor */}
                            <div className="md:col-span-2 rounded-lg border border-gray-200 p-4">
                                <div className="text-sm font-semibold text-gray-600 mb-3">Classes for {selectedTutor || "..."}</div>

                                {selectedTutor ? (
                                    tutorClasses.length ? (
                                        <div className="space-y-3 max-h-60 overflow-auto pr-2">
                                            {tutorClasses.map((cls) => (
                                                <div key={cls.classId} className="flex items-center justify-between p-3.5 border border-gray-200 rounded-lg">
                                                    <div className="text-gray-800">
                                                        <div className="font-semibold">{cls.classId}</div>
                                                        <div className="text-sm text-gray-600">Day: {cls.day} &bull; Period: {cls.period} &bull; Room: {cls.room}</div>
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-full hover:opacity-90 transition"
                                                            onClick={() => handleChangeClass(cls)}
                                                        >
                                                            Select
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 p-4 text-center">No classes found for this tutor.</div>
                                    )
                                ) : (
                                    <div className="text-sm text-gray-500 p-4 text-center">Select a tutor to see available classes.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default RegisterCourse;