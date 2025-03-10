import { Shield, Bell, Activity, Clock, Globe, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const featureItems = [
  {
    title: "Uptime Monitoring",
    description: "Monitor your websites and APIs every second from multiple global locations.",
    icon: <Activity className="h-10 w-10 text-primary" />,
  },
  {
    title: "Instant Alerts",
    description: "Get notified instantly when downtime is detected through multiple channels.",
    icon: <Bell className="h-10 w-10 text-primary" />,
  },
  {
    title: "Global Coverage",
    description: "Monitor from 30+ locations worldwide to ensure your service is available everywhere.",
    icon: <Globe className="h-10 w-10 text-primary" />,
  },
  {
    title: "Response Time Tracking",
    description: "Track and analyze your website's response times to optimize performance.",
    icon: <Clock className="h-10 w-10 text-primary" />,
  },
  {
    title: "SSL Certificate Monitoring",
    description: "Get alerted before your SSL certificates expire to prevent security issues.",
    icon: <Shield className="h-10 w-10 text-primary" />,
  },
  {
    title: "Detailed Reports",
    description: "Access comprehensive reports and analytics to understand your website's performance.",
    icon: <ArrowUpRight className="h-10 w-10 text-primary" />,
  },
];

const Features = () => {
  return (
    <section className="py-20 border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Monitoring Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to ensure your websites and services are always up and running smoothly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureItems.map((feature, index) => (
            <Card key={index} className="bg-card border-border/50 hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;