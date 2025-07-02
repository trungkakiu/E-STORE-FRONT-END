import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AnimatedCard = ({ children }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-4"
      >
        {children}
      </motion.div>
    );
  };
  
export default AnimatedCard;