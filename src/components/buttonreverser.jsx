import { useState } from "react";
import { motion } from "framer-motion";

export function FlipButton({ text1, text2 }) {
  const [show, setShow] = useState(false);

  const flipVariants = {
    one: {
      rotateX: 0,
      color: "#e97d7d",
      className:"btn1",
    },
    two: {
      rotateX: 180,
      backgroundColor: "#8989ea",
      color: "#18181b",
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
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
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