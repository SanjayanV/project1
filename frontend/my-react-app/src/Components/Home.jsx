import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

// Dummy Dashboard component remains unchanged
const Dashboard = () => (
  <div className="min-h-screen bg-gray-100 p-6">
    <h1 className="text-4xl font-bold text-center text-gray-800">Welcome to Your Dashboard</h1>
    <p className="text-center text-gray-600 mt-4">This is your personalized dashboard.</p>
  </div>
);

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Farmers', href: '#farmers' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
      {/* Header */}
      <motion.header 
        className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-2">
            <span className="text-yellow-500 text-2xl">🌾</span>
            <span className="text-2xl font-bold text-gray-800">Farm2Consumer</span>
          </a>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <div className={`md:flex ${isMenuOpen ? 'block' : 'hidden'} absolute md:static top-16 right-6 md:right-auto bg-white md:bg-transparent shadow-md md:shadow-none rounded-lg md:rounded-none p-4 md:p-0`}>
              <div className="flex flex-col md:flex-row md:space-x-6">
                {navItems.map((item) => (
                  <a 
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="py-2 px-4 text-gray-600 hover:text-emerald-600 transition-colors font-medium hover:bg-gray-100 md:hover:bg-transparent rounded-md"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6 bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center max-w-4xl">
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-800 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Fresh from Farm to Table
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connecting farmers and consumers through blockchain-powered transparency
          </motion.p>
          <Link to="/login">
            <motion.button 
              className="bg-emerald-600 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-700 transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: '🌿', title: 'Organic Farming', desc: 'Pure, pesticide-free produce' },
              { icon: '🚜', title: 'Direct Sourcing', desc: 'From farm to your table' },
              { icon: '🔒', title: 'Blockchain Tracking', desc: 'Transparent supply chain' },
              { icon: '🛒', title: 'Easy Ordering', desc: 'Shop with convenience' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 text-center"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="text-5xl mb-4 text-emerald-600 mx-auto">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">About Us</h2>
            <p className="text-gray-600 mb-8">
              We connect farmers directly with consumers using blockchain technology for trust and transparency. Our mission is to support local agriculture and deliver fresh, quality produce to your doorstep.
            </p>
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-all shadow-sm">
              Learn More
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <img 
              src="https://media.istockphoto.com/id/543212762/photo/tractor-cultivating-field-at-spring.jpg?s=612x612&w=0&k=20&c=uJDy7MECNZeHDKfUrLNeQuT7A1IqQe89lmLREhjIJYU=" 
              alt="Farm" 
              className="w-full h-80 object-cover rounded-xl shadow-md"
            />
          </motion.div>
        </div>
      </section>

      {/* Farmers Section */}
      <section id="farmers" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">Our Technology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Blockchain', img: 'https://img.freepik.com/premium-vector/blockchain-line-icon-logo-concept-dark-background_516670-196.jpg?semt=ais_hybrid' },
              { name: 'F2C', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn=9GcTopU_LDClItBwaUawWxNmjGdHlT17Giau3Xg&s' },
              { name: 'S2C', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Sustainable_Development_Goal_02ZeroHunger.svg/1200px-Sustainable_Development_Goal_02ZeroHunger.svg.png' },
              { name: 'Buy & Sell', img: 'https://cdn-icons-png.flaticon.com/512/13799/13799176.png' },
            ].map((farmer, index) => (
              <motion.div
                key={farmer.name}
                className="text-center bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <img 
                  src={farmer.img} 
                  alt={farmer.name} 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800">{farmer.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { quote: 'Fresh produce like never before!', name: 'Amit' },
              { quote: 'Love the transparency with blockchain!', name: 'Priya' },
              { quote: 'Best way to support farmers!', name: 'Rahul' },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <p className="text-gray-800 font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-lg text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">Contact Us</h2>
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800"
              required
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800"
              required
            />
            <textarea 
              placeholder="Your Message" 
              rows="5" 
              className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800"
              required
            ></textarea>
            <button 
              type="submit" 
              className="w-full bg-emerald-600 text-white p-4 rounded-lg hover:bg-emerald-700 transition-all shadow-md"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-800 text-gray-300">
        <div className="container mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 max-w-6xl mx-auto">
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                <span className="text-emerald-500">🌾</span> 
                <span>Farm2Consumer</span>
              </h4>
              <p className="text-gray-400">Connecting farms to homes</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Links</h4>
              {navItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block text-gray-400 hover:text-white transition-colors py-1"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">support@farm2consumer.com</p>
              <p className="text-gray-400">+1 234 567 890</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <div className="flex justify-center">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="p-2 rounded-l-lg bg-gray-700 text-gray-300 border border-gray-600 focus:outline-none w-full md:w-auto"
                />
                <button className="p-2 bg-emerald-600 rounded-r-lg hover:bg-emerald-700 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mb-4">
            {['Facebook', 'Twitter', 'Instagram'].map((social) => (
              <a 
                key={social}
                href="#" 
                className="text-xl text-gray-400 hover:text-emerald-500 transition-all"
              >
                {social === 'Facebook' ? '📘' : social === 'Twitter' ? '🐦' : '📸'}
              </a>
            ))}
          </div>
          <p className="text-gray-400">© 2025 Farmer To Consumer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;