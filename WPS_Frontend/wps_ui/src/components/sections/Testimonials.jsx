import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO, TechFlow Inc.",
    content: "WebPulse Stack has been a game-changer for our uptime monitoring. The instant alerts have helped us resolve issues before our customers even notice them.",
    initials: "SJ",
    avatar: "/api/placeholder/40/40",
  },
  {
    name: "Michael Chen",
    role: "DevOps Lead, DigitalSphere",
    content: "The detailed metrics and reporting have given us incredible insights into our application performance. We've improved our response times by 30% since implementing WebPulse Stack.",
    initials: "MC",
    avatar: "/api/placeholder/40/40",
  },
  {
    name: "Emma Rodriguez",
    role: "Founder, StartupBoost",
    content: "As a startup founder, I need to know our services are always available. WebPulse Stack gives me peace of mind with reliable monitoring and clear notifications.",
    initials: "ER",
    avatar: "/api/placeholder/40/40",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands of companies worldwide to keep their services running smoothly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border/50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">{`"${testimonial.content}"`}</p>
              </CardContent>
              <CardFooter>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;