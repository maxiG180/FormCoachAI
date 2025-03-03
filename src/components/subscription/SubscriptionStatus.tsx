// File: src/components/Subscription/SubscriptionStatus.tsx

import { useEffect, useState } from "react";
import { checkSubscriptionStatus } from "../../services/subscriptionService";

const SubscriptionStatus = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const status = await checkSubscriptionStatus();
      setIsSubscribed(status);
      setIsLoading(false);
    };

    fetchSubscriptionStatus();
  }, []);

  if (isLoading) {
    return <div>Loading subscription status...</div>;
  }

  return (
    <div className="bg-brand-secondary/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Subscription Status
      </h3>
      <p className="text-white">
        {isSubscribed
          ? "You are subscribed!"
          : "You are not subscribed. Please subscribe to access all features."}
      </p>
    </div>
  );
};

export default SubscriptionStatus;
