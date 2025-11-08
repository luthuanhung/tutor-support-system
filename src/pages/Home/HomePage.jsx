import React from 'react';
import Header from '../../components/header/Header'; // Adjust path as needed
import Footer from '../../components/footer/Footer'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

// You can import an image like this if it's in your src folder
// import heroImage from '../assets/hero-bg.jpg'; 
// Or use a direct URL

export default function HomePage() {
    const navigate = useNavigate();
return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
        <Header />

        <main>
        {/* Hero Section */}
        <section 
            className="relative bg-linear-to-r from-primary to-border-primary text-white py-20 md:py-32 overflow-hidden"
            // If you have a local image, uncomment and use it:
            // style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            
            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
                    Unlock Your Potential with Our Learning Platform
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up delay-200">
                    Dive into engaging courses, connect with experts, and master new skills at your own pace.
                </p>
                {/* <div className="flex justify-center md:justify-start gap-4 animate-fade-in-up delay-400">
                    <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition duration-300">
                        Explore Courses
                    </button>
                    <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-full shadow-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition duration-300">
                        Get Started
                    </button>
                </div> */}
            </div>
            
                {/* Image Placeholder (Add your desired picture here) */}
                <div className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0 animate-fade-in-right delay-600">
                    {/* Replace "https://via.placeholder.com/400" with your image URL or imported image */}
                    <img 
                    src="../../src/assets/learningpage.png" 
                    alt="Learning illustration" 
                    className="rounded-lg object-cover max-w-full h-auto"
                    />
                </div>
            </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-secondary py-20 text-white text-center">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to Start Learning?</h2>
                <p className="text-xl opacity-90 mb-10">Join thousands of successful learners today.</p>
                <button className="px-10 py-4 bg-white text-primary font-bold text-lg rounded-full shadow-lg 
                                hover:bg-gray-100 transform hover:scale-105 transition duration-300 cursor-pointer"
                        onClick={() => navigate("/login")}>
                    Sign Up Now
                </button>
            </div>
        </section>
        </main>

        <Footer />
    </div>
    );
}