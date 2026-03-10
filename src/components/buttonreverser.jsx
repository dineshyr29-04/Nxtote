import { useState } from "react";
import { motion } from "framer-motion";

export function FlipButton({ text1, text2 }) {
  const [show, setShow] = useState(false);

  const flipVariants = {
    one: {
      rotateX: 0,
      color: "#0b0a0a",
      // CSS variables allow smooth color interpolation for gradients
      "--btn-g1": "#83e3f8",
      "--btn-g2": "#55b7e7",
      boxShadow:"0 4px 12px #594e4e",
      borderColor:"#cb12f57c",
    },
    two: {
      rotateX: 180,
      color: "#18181f",
      "--btn-g1": "#2b7ec6",
      "--btn-g2": "#efca6e",
    },
  };

  return (
    <div className="container-btn">
      <motion.button
        className="togglerbtn"
        style={{ borderRadius: 999 }}
        onClick={() => setShow(!show)}
        animate={show ? "two" : "one"}
        variants={flipVariants}
        transition={{ type: "spring", stiffness: 100, damping: 10, mass: 1  }} whileTap={{ scale: 0.95}}
        whileHover={{ scale: 1 }}
        
      >
        <motion.div
          animate={{ rotateX: show ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {show ? text1 : text2}
        </motion.div>

        <motion.div
          animate={{ rotateX: show ? 0 : -180 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="absolute inset-0"
        />
      </motion.button>
    </div>
  );
}