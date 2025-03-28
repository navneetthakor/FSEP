import { Button } from "../ui/button";
import { CheckIcon } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for small websites and personal projects",
    features: [
      "5 monitors",
      "60-second check intervals",
      "10 global locations",
      "Email alerts",
      "7-day data retention",
      "Basic reporting",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$79",
    description: "Ideal for growing businesses and professional websites",
    features: [
      "20 monitors",
      "30-second check intervals",
      "20 global locations",
      "Email, SMS, Slack alerts",
      "30-day data retention",
      "Advanced reporting",
      "API access",
      "Custom status pages",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    description: "For large organizations with complex monitoring needs",
    features: [
      "Unlimited monitors",
      "1-second check intervals",
      "30+ global locations",
      "All alert channels",
      "90-day data retention",
      "Full API access",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantees",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section className="py-20 border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for your business. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-lg border ${
                plan.popular 
                  ? "border-primary" 
                  : "border-border/50"
              } p-8 relative flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mt-3">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                size="lg" 
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;