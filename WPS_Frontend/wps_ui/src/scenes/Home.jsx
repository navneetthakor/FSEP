// imports by claude 
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import HowItWorks from "../components/sections/HowItWorks";
import Testimonials from "../components/sections/Testimonials";
import Pricing from "../components/sections/Pricing";
import CTASection from "../components/sections/CTASection";

function Home() {
    return (

        <div className="flex flex-col bg-background text-foreground min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <Pricing />
            <CTASection />
          </main>
          <Footer />
        </div>
    );
  }
  
  export default Home;