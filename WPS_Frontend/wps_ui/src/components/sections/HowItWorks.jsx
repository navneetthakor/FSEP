import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Sign up for WebPulse Stack",
    description: "Create an account in just a few seconds and start your 14-day free trial with no credit card required.",
  },
  {
    number: "02",
    title: "Add your websites or services",
    description: "Enter the URLs you want to monitor. You can add as many as you need with different check intervals.",
  },
  {
    number: "03",
    title: "Configure your alert preferences",
    description: "Choose how you want to be notified: email, Slack, SMS, webhook, or other integrations.",
  },
  {
    number: "04",
    title: "Receive instant notifications",
    description: "Get alerted immediately when issues are detected so you can address them before your users notice.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How WebPulse Stack Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Setting up powerful uptime monitoring has never been easier.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-lg p-8 border border-border/50">
            <h3 className="text-xl font-bold mb-6">Key Benefits</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span>24/7 monitoring from multiple global locations</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span>Monitoring intervals as low as 1 second</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span>Real-time alerts through multiple channels</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span>Comprehensive performance metrics and reporting</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span>SSL certificate monitoring and expiration alerts</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span>Custom status pages for transparent communication</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;