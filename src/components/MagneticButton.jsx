import { motion } from 'motion/react';
import { Link } from 'react-router-dom';


const MotionButton = motion.button;
const MotionLink = motion.create(Link);
const MotionAnchor = motion.a;

function MagneticButton({ as = 'button', className, children, ...props }) {
  const Component = as === 'link' ? MotionLink : as === 'a' ? MotionAnchor : MotionButton;

  return (
    <Component
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export default MagneticButton;
