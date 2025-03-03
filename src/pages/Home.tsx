// pages/Home.tsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProcessCard from "../components/home/ProcessCard";
import TestimonialCard from "../components/home/TestimonialCard";

import {
  PlayCircle,
  Shield,
  Zap,
  LineChart,
  Target,
  Activity,
  Video,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative bg-brand-dark">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32">
        <div className="absolute inset-0">
          {/* Creating a subtle radial gradient background that matches your brand colors */}
          <div className="absolute inset-0 bg-gradient-radial from-brand-primary/5 via-transparent to-transparent animate-pulse-slow"></div>
          {/* Adding a subtle grid pattern for depth */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 101, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 101, 0, 0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
              Transform Your Workouts with{" "}
              <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                AI-Powered Form Analysis
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-brand-gray leading-relaxed max-w-3xl mx-auto">
              Get real-time feedback on your exercise form using advanced AI
              technology. Train smarter, prevent injuries, and achieve your
              fitness goals with precision.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              {user ? (
                <Link
                  to="/analyze"
                  className="btn btn-primary btn-lg gap-2 group transition-all duration-300 hover:scale-105"
                >
                  Start Analysis
                  <ArrowRight className="w-5 h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="btn btn-primary btn-lg gap-2 group transition-all duration-300 hover:scale-105"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/demo"
                    className="btn btn-ghost btn-lg text-brand-gray hover:text-white gap-2"
                  >
                    <PlayCircle className="w-6 h-6" />
                    Watch Demo
                  </Link>
                </>
              )}
            </div>

            {/* Stats Section with your brand styling */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <StatCard number="10k+" label="Active Users" />
              <StatCard number="98%" label="Success Rate" />
              <StatCard number="50+" label="Exercise Types" />
              <StatCard number="24/7" label="AI Analysis" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative bg-gradient-to-b from-brand-dark to-brand-secondary">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Why Choose FitCorrect AI?"
            subtitle="Experience the future of fitness with our advanced AI technology"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-brand-primary" />}
              title="Real-time Analysis"
              description="Our AI provides instant feedback on your form, helping you correct issues before they become habits."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-brand-primary" />}
              title="Injury Prevention"
              description="Train with confidence knowing our AI watches your form to help prevent potential injuries."
            />
            <FeatureCard
              icon={<Video className="w-6 h-6 text-brand-primary" />}
              title="Video Analysis"
              description="Upload your workout videos for detailed analysis and personalized improvement suggestions."
            />

            <FeatureCard
              icon={<Target className="w-6 h-6 text-brand-primary" />}
              title="Goal Tracking"
              description="Set personal fitness goals and track your progress with detailed metrics and insights."
            />
            <FeatureCard
              icon={<Activity className="w-6 h-6 text-brand-primary" />}
              title="Performance Analytics"
              description="View comprehensive analytics about your form improvement and exercise patterns."
            />
            <FeatureCard
              icon={<LineChart className="w-6 h-6 text-brand-primary" />}
              title="Progress Reports"
              description="Receive detailed reports showing your improvement journey and achievement milestones."
            />

            {/* Add more feature cards as needed */}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative bg-brand-dark">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Getting Started is Simple"
            subtitle="Three easy steps to perfect your form with AI assistance"
          />

          <div className="grid md:grid-cols-3 gap-8 mt-16 relative">
            {/* Connected line decoration */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20"></div>

            <ProcessCard
              number={1}
              icon={<Video className="w-6 h-6 text-brand-primary" />}
              title="Record Your Workout"
              description="Use your device's camera or upload a video of your exercise routine"
            />
            <ProcessCard
              number={2}
              icon={<Zap className="w-6 h-6 text-brand-primary" />}
              title="AI Analysis"
              description="Get instant feedback on your form with our advanced AI technology"
            />
            <ProcessCard
              number={3}
              icon={<Target className="w-6 h-6 text-brand-primary" />}
              title="Improve & Track"
              description="Follow personalized suggestions and track your progress over time"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative bg-brand-secondary">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="What Our Users Say"
            subtitle="Join thousands of satisfied users who have improved their workout form"
          />

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <TestimonialCard
              quote="FitCorrect AI helped me perfect my squat form and prevent knee pain. It's like having a personal trainer 24/7!"
              author="Sarah M."
              role="Fitness Enthusiast"
            />
            <TestimonialCard
              quote="The real-time feedback is incredible. It's completely changed how I approach my workout routine."
              author="James K."
              role="CrossFit Athlete"
            />
            <TestimonialCard
              quote="As a personal trainer, I recommend this to all my clients for maintaining proper form between sessions."
              author="Michael R."
              role="Personal Trainer"
            />
          </div>
        </div>
      </section>

      {/* CTA Section with your brand gradient */}
      <section className="py-20 relative bg-brand-dark">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 p-12">
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Perfect Your Form?
              </h2>
              <p className="text-brand-gray text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who have transformed their workout
                experience with FitCorrect AI.
              </p>
              {!user && (
                <Link
                  to="/signup"
                  className="btn btn-primary btn-lg gap-2 group"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Components
const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="card bg-gradient-to-br from-brand-secondary to-brand-dark border border-brand-primary/10 hover:border-brand-primary/20 transition-all duration-300">
    <div className="card-body items-center text-center p-6">
      <h3 className="text-2xl md:text-3xl font-bold text-brand-primary mb-2">
        {number}
      </h3>
      <p className="text-sm text-brand-gray">{label}</p>
    </div>
  </div>
);

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  const [ref, inView] = useInView();
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="card bg-brand-secondary hover:bg-brand-secondary/80 border border-brand-primary/10 hover:border-brand-primary/20 transition-all duration-300"
    >
      <div className="card-body p-6">
        <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="card-title text-white mb-2">{title}</h3>
        <p className="text-brand-gray">{description}</p>
      </div>
    </motion.div>
  );
};

const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="text-center max-w-2xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
    <p className="text-brand-gray text-lg">{subtitle}</p>
  </div>
);

export default Home;
