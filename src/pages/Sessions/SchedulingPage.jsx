import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import MySessions from "../../components/session_list/MySessions";
import { Link, useNavigate } from "react-router-dom";
export default function SchedulingPage({isTutor = true, isRegister = false}) {
  return (
    <div className="">
      <Header />
      <MySessions 
        isTutor = {isTutor}
        isRegister = {isRegister}
      />
      <Footer />
    </div>
  );
};
