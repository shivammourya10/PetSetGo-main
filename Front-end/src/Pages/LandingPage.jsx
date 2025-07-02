import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import PixelCard from '../Blocks/Components/PixelCard/PixelCard';
import SplashCursor from '../Blocks/Animations/SplashCursor/SplashCursor';
import DecryptedText from '../Blocks/TextAnimations/DecryptedText/DecryptedText';

const ServiceDetails = {
  "Pet Mate": {
    title: "Pet Mate - Social Connection for Pets",
    description: `Connect your pets with compatible companions in your area. Our intelligent matching system considers breed, temperament, age, and activity levels to find the perfect playmate for your furry friend. Create playdates, arrange meetups, and help your pet build lasting friendships. Features include:
    • Detailed pet profiles
    • Location-based matching
    • Scheduling tools
    • Chat with other pet owners
    • Activity recommendations
    • Safety guidelines and tips`
  },
  "Adopt": {
    title: "Pet Adoption - Find Your Perfect Companion",
    description: `Make a difference in a pet's life through our comprehensive adoption platform. We connect loving homes with pets in need, providing all the necessary information and support throughout the adoption process. Our service includes:
    • Verified shelter partnerships
    • Detailed pet backgrounds
    • Health records
    • Adoption guidance
    • Post-adoption support
    • Regular follow-ups`
  },
  "Pet Products": {
    title: "Premium Pet Products - Quality Essentials",
    description: `Access a curated selection of high-quality pet products, from nutrition to accessories. Every product is vetted by our experts to ensure the best for your pet. Our marketplace features:
    • Premium food brands
    • Veterinary-approved supplies
    • Eco-friendly options
    • Regular quality checks
    • Expert recommendations
    • Competitive pricing`
  },
  "Personalized Diet": {
    title: "Custom Diet Plans - Tailored Nutrition",
    description: `Get expert-designed diet plans customized to your pet's specific needs. Our nutrition experts consider age, breed, health conditions, and lifestyle to create the perfect meal plan. Benefits include:
    • Personalized meal portions
    • Ingredient recommendations
    • Dietary restrictions handling
    • Regular plan updates
    • Nutritionist consultations
    • Progress tracking`
  }
};

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const servicesRef = useRef(null);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (<div>
    
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 to-pink-100 font-sans">
<SplashCursor/>


        
      {/* Hero Section */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full z-0 opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
        >
          <img src="https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Pet Care" className="object-cover w-full h-full" />
        </motion.div>

        <div className="relative z-10 text-white space-y-6">
          <motion.h1
            className="text-6xl font-extrabold drop-shadow-md mb-6"
            initial={{ opacity: 0, y: -70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 3 }}
          >
            Welcome to PetCare Haven
          </motion.h1>

          <motion.p
            className="text-xl max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            Your pet's health and happiness are our top priority. Explore our services and make life better for your furry friends.
          </motion.p>

          <motion.button
            className="bg-pink-600 text-white py-3 px-8 rounded-lg shadow-lg text-lg font-semibold hover:bg-pink-700 transition duration-300"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            Get Started
          </motion.button>
        </div>

        {/* Animated Down Arrow */}
        <motion.div 
          className="absolute bottom-10 cursor-pointer"
          onClick={scrollToServices}
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="flex flex-col items-center text-white">
            <p className="text-sm mb-2">Explore More</p>
            <svg 
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </div>
      

    {/* Services Section with PixelCards */}
        <div ref={servicesRef} className="py-20 bg-gradient-to-b from-green-100 to-purple-100">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Explore Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto px-4">
            {[
            { 
              title: "Pet Mate", 
              desc: "Find your pet's perfect companion.", 
              variant: "pink",
              imageUrl: "https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?auto=compress&cs=tinysrgb&w=800",
              imageShape: "rounded-full" // Options: 'rounded-full', 'rounded-lg', 'none'
            },
            { 
              title: "Adopt", 
              desc: "Give a pet a loving home.", 
              variant: "yellow",
              imageUrl: "https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?auto=compress&cs=tinysrgb&w=800",
              imageShape: "rounded-full"
            },
            { 
              title: "Pet Products", 
              desc: "Find quality pet essentials.", 
              variant: "pink",
              imageUrl: "https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?auto=compress&cs=tinysrgb&w=800",
              imageShape: "rounded-full"
            },
            { 
              title: "Personalized Diet", 
              desc: "Get a custom diet plan for your pet.", 
              variant: "yellow",
              imageUrl: "https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?auto=compress&cs=tinysrgb&w=800",
              imageShape: "rounded-full"
            }
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <PixelCard
                variant={service.variant}
                className="cursor-pointer"
                onClick={() => openModal(service.title)}
                imageUrl={service.imageUrl} // Pass imageUrl prop
                imageShape={service.imageShape} // Pass imageShape prop
              >
                <div className="relative z-10 p-6 text-center ">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 ">{service.title}</h3>
                  <p className="text-gray-600 text-lg">{service.desc}</p>
                  <button 
                    className="mt-6 px-6 py-2 bg-pink-600/90 text-white rounded-lg hover:bg-pink-700/90 transition duration-300"
                    onClick={() => openModal(service.title)}
                  >
                    Learn More
                  </button>
                </div>
              </PixelCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Dialog */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md p-6 text-left align-middle shadow-xl transition-all border border-white/20">
                  {selectedService && (
                    <>
                      <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                        {ServiceDetails[selectedService].title}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                          {ServiceDetails[selectedService].description}
                        </p>
                      </div>
                    </>
                  )}
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-pink-600/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-pink-700/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 transition-all duration-200"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Additional Features */}
      <div className="py-20 bg-gradient-to-b from-purple-100 to-pink-100">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Additional Features</h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-4">
          {[
            { title: "Pet Community Forum", desc: "Connect with fellow pet lovers." },
            { title: "Vet Articles & Tips", desc: "Get expert guidance and resources." }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

    {/* About Us */}
        <div className="py-20 bg-white text-center">
            <h2 className="text-5xl font-extrabold mb-6 text-gray-800">About Us</h2>
            <div style={{ marginTop: '4rem' }}>
                <DecryptedText
                    text="At Pet Wellbeing, we are passionate about providing a one-stop platform that makes pet care effortless, enjoyable, and deeply rewarding. We understand that pets are not just animals; they are family, companions, and a source of unconditional love. Our mission is to enhance the lives of pets and their owners by offering expert guidance, innovative solutions, and a supportive community—all in one place.

Our Vision

We envision a world where every pet gets the best possible care, and every pet parent has the knowledge and resources to ensure their furry friends lead healthy, happy, and fulfilling lives."
                    speed={100}
                    maxIterations={10}
                    characters="ABCD1234!?"
                    className="revealed"
                    parentClassName="all-letters"
                    encryptedClassName="encrypted"
                    animateOn="view"
                    revealDirection="center"
                />
            </div>
        </div>

        {/* Footer */}
      <div className="bg-gray-800 py-12 text-center text-white">
        <p className="text-lg">&copy; 2025 PetCare Haven. All rights reserved.</p>
        <p className="text-sm mt-2">Follow us on social media</p>
      </div>
    </div>

    </div>
  );
};

export default LandingPage;
