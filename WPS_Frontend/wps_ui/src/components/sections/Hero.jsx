import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Hero = () => {
  return (
    <section className="py-20 border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text mb-6">
            WebPulse Stack
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            because every second counts
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive uptime monitoring for websites and services that keeps your business running smoothly
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-background border-border w-full" 
            />
            <Button size="lg" className="w-full sm:w-auto">
              Sign Up
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Free 14-day trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;