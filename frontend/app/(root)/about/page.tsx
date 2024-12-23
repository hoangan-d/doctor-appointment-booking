import React from 'react'

const About = () => {
    return (
        <div className=" min-h-screen p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">About Us</h1>
                <p className="text-gray-700 text-lg leading-relaxed text-center mb-8">
                    Welcome to Healthspot! We are committed to providing top-notch healthcare services
                    to our community. Our mission is to ensure that every patient receives the highest
                    level of care with compassion, respect, and professionalism.
                </p>

                <div className="grid md:grid-cols-2 gap-10">
                    <div>
                        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Our Vision</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            We envision a world where quality healthcare is accessible to everyone. At Healthspot,
                            we strive to be at the forefront of innovation in healthcare, ensuring our patients receive
                            the most advanced and effective treatments available.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Our Mission</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Our mission is to enhance the health and well-being of our patients through patient-centered care,
                            cutting-edge medical technology, and a dedicated team of professionals. We believe in a holistic approach
                            to health that promotes both physical and mental well-being.
                        </p>
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">Meet Our Team</h2>
                    <div className="flex flex-wrap justify-center">
                        <div className="bg-white shadow-lg rounded-lg p-6 m-4 max-w-xs text-center">
                            <img
                                src="/JohnDoe.png"
                                alt="Dr. John Doe"
                                className="rounded-md mx-auto mb-4 w-32 h-32 object-cover"
                            />
                            <h3 className="text-xl font-bold text-blue-600">Dr. John Doe</h3>
                            <p className="text-gray-600">Chief Medical Officer</p>
                            <p className="text-gray-600 text-sm mt-2">"Committed to providing exceptional care for every patient."</p>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg p-6 m-4 max-w-xs text-center">
                            <img
                                src="/JaneSmith.png"
                                alt="Dr. Jane Smith"
                                className="rounded-md mx-auto mb-4 w-32 h-32 object-cover"
                            />
                            <h3 className="text-xl font-bold text-blue-600">Dr. Jane Smith</h3>
                            <p className="text-gray-600">Lead Surgeon</p>
                            <p className="text-gray-600 text-sm mt-2">"Dedicated to advancing surgical excellence and patient care."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default About