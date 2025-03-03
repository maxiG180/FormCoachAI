import { motion } from "framer-motion";

const TestimonialCard = ({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="card bg-brand-dark border border-brand-primary/10 hover:border-brand-primary/20 transition-all duration-300"
  >
    <div className="card-body p-6">
      <div className="mb-4 text-brand-primary">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-brand-gray mb-4">{quote}</p>
      <div className="mt-auto">
        <p className="font-semibold text-white">{author}</p>
        <p className="text-sm text-brand-gray">{role}</p>
      </div>
    </div>
  </motion.div>
);

export default TestimonialCard;
