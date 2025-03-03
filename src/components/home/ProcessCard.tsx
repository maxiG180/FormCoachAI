import { motion } from "framer-motion";

const ProcessCard = ({
  number,
  icon,
  title,
  description,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative"
  >
    <div className="card bg-brand-secondary hover:bg-brand-secondary/80 border border-brand-primary/10 hover:border-brand-primary/20 transition-all duration-300">
      <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div className="card-body p-6">
        <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="card-title text-white mb-2">{title}</h3>
        <p className="text-brand-gray">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default ProcessCard;
