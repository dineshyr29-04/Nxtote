import { useState } from "react";
import { motion } from "framer-motion";

export function FlipButton({ text1, text2 }) {
  const [show, setShow] = useState(false);

  const flipVariants = {
    one: {
      rotateX: 0,
      color: "#e97d7d",
      // CSS variables allow smooth color interpolation for gradients
      "--btn-g1": "#ff9a9e",
      "--btn-g2": "#fad0c4",
      boxShadow:"#594e4e",
      borderColor:"#eed9d9",
    },
    two: {
      rotateX: 180,
      color: "#18181b",
      "--btn-g1": "#a18cd1",
      "--btn-g2": "#fbc2eb",
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
        transition={{ duration: 0.6, type: "spring" }}
        whileTap={{ scale: 0.8}}
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