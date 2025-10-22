const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Vea Pamela A. Gumatay",
      role: "Software Developer",
      avatar: "👩‍💻",
      bio: "Vea leads the software development of the web application, focusing on creating an intuitive and responsive user interface, integrating backend systems, and ensuring seamless communication between devices and the app."
    },
    {
      id: 2,
      name: "Ryan E. Dao-ayan",
      role: "Software Technician",
      avatar: "🧑‍🔧",
      bio: "Ryan handles system testing, debugging, and maintenance of the application, ensuring that every function runs smoothly and efficiently across all platforms."
    },
    {
      id: 3,
      name: "Justin Andrei S. Acero",
      role: "Hardware Lead",
      avatar: "⚙️",
      bio: "Justin is responsible for designing and integrating the hardware components of the dual ACU and fan system, ensuring stability, functionality, and compatibility with the web interface."
    },
    {
      id: 4,
      name: "Dan Lloyd L. Resmundo",
      role: "Hardware Assistant",
      avatar: "🔩",
      bio: "Dan assists in assembling, wiring, and testing the hardware setup, supporting the hardware team in ensuring optimal performance and system reliability."
    },
    {
      id: 5,
      name: "Raella Marie H. Rosel",
      role: "Document Manager",
      avatar: "🗂️",
      bio: "Raella manages all documentation processes, including research records, technical reports, and project documentation, ensuring that all outputs are organized and professionally presented."
    },
    {
      id: 6,
      name: "Jiehel Mae I. Deocales",
      role: "Procurement Manager",
      avatar: "📦",
      bio: "Jiehel oversees the acquisition of all necessary materials, components, and resources needed for the project, ensuring cost-effectiveness and timely procurement."
    }
  ]

  const features = [
    {
      icon: "🌡️",
      title: "Smart Temperature Control",
      description: "Automatically adjusts fan speed and ACU cooling based on real-time room temperature and user preferences to maintain optimal comfort."
    },
    {
      icon: "🕒",
      title: "Automated Scheduling",
      description: "Allows users to set specific operation times for the ACU and fans—helping reduce unnecessary energy consumption and keeping the environment comfortable when needed."
    },
    {
      icon: "📊",
      title: "Usage Analysis",
      description: "Provides detailed insights and reports on energy usage patterns to help users make smarter and more efficient decisions."
    },
    {
      icon: "🌐",
      title: "Remote Management",
      description: "Enables full control of the dual ACU and electric fans via a secure web application, accessible anytime and anywhere."
    },
    {
      icon: "⚡",
      title: "Energy Saving",
      description: "Optimizes power consumption by intelligently balancing performance and efficiency, reducing both electricity costs and environmental impact."
    },
    {
      icon: "🔒",
      title: "Privacy & Security",
      description: "Ensures the protection of user data and device control through encrypted communication and robust authentication protocols."
    }
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-aircon-gray-800 dark:text-white tracking-widest mb-4">
          About chEElax
        </h1>
        <p className="text-aircon-gray-600 dark:text-gray-300 max-w-4xl mx-auto text-lg leading-relaxed">
          chEElax is a research and development group dedicated to creating innovative and energy-efficient home solutions. The team's current project focuses on the design and integration of a dual air conditioning unit (ACU) and four electric fans into a single intelligent system that can be controlled through a web-based application. This system allows users to effortlessly monitor, manage, and optimize their cooling devices anytime and anywhere—making comfort smarter, simpler, and more sustainable.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="card p-8 max-w-4xl mx-auto text-center dark:bg-black dark:border-gray-800">
        <h2 className="text-2xl font-bold text-aircon-gray-800 dark:text-white mb-6 tracking-widest">
          Mission
        </h2>
        <p className="text-aircon-gray-600 dark:text-gray-300 text-lg leading-relaxed">
          Our mission at chEElax is to provide a user-friendly, intelligent, and energy-efficient system that enhances comfort and convenience through smart technology. We aim to empower users with an easy-to-use web application that enables real-time control and automation of cooling devices, while promoting energy conservation and modern living efficiency.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-aircon-gray-800 dark:text-white mb-8 text-center tracking-widest">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card p-6 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-black dark:border-gray-800">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-aircon-gray-800 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-aircon-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-aircon-gray-800 dark:text-white mb-8 text-center tracking-widest">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="card p-6 text-center dark:bg-black dark:border-gray-800">
              <div className="mb-4 flex justify-center">
                {member.avatar.startsWith('/') ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="text-6xl">{member.avatar}</div>
                )}
              </div>
              <h3 className="font-semibold text-aircon-gray-800 dark:text-white mb-2">{member.name}</h3>
              <p className="text-sm text-aircon-blue-600 dark:text-teal-400 font-medium mb-3">{member.role}</p>
              <p className="text-xs text-aircon-gray-600 dark:text-gray-300 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>


      {/* Contact Information */}
      <div className="card p-8 max-w-2xl mx-auto text-center dark:bg-black dark:border-gray-800">
        <h2 className="text-2xl font-bold text-aircon-gray-800 dark:text-white mb-6 tracking-widest">
          GET IN TOUCH
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-aircon-gray-800 dark:text-white mb-2">Email</h3>
            <p className="text-aircon-gray-600 dark:text-gray-300">support@cheelax.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-aircon-gray-800 dark:text-white mb-2">Phone</h3>
            <p className="text-aircon-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="font-semibold text-aircon-gray-800 dark:text-white mb-2">Address</h3>
            <p className="text-aircon-gray-600 dark:text-gray-300">
              123 Smart Street<br />
              Tech City, TC 12345
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-aircon-gray-500 dark:text-gray-400">
            © 2024 chEElax. All rights reserved. Built with ❤️ for a smarter future.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
