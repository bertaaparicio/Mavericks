import { Activity, Children } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

const defaultVariants = {
  center: { opacity: 1, x: 0, zIndex: 1 },
  enter: ({ direction, shouldReduceMotion }) => ({
    opacity: 0,
    position: "initial",
    x: shouldReduceMotion ? 0 : direction > 0 ? -20 : 20,
  }),
  exit: ({ direction, shouldReduceMotion }) => ({
    left: 0,
    opacity: 0,
    padding: "inherit",
    position: "absolute",
    top: 0,
    width: "100%",
    x: shouldReduceMotion ? 0 : direction < 0 ? -15 : 15,
    zIndex: 0,
  }),
};

const defaultTransition = {
  duration: 0.15,
  ease: "easeInOut",
  x: { damping: 30, stiffness: 200, type: "spring" },
};

const TransitionPanel = ({
  activeIndex,
  direction,
  className,
  children,
  transition = defaultTransition,
  variants = defaultVariants,
  mode = "popLayout",
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();
  const custom = { direction, shouldReduceMotion };

  return (
    <AnimatePresence custom={custom} initial={false} mode={mode}>
      {Children.map(children, (child, index) => {
        const isActive = index === activeIndex;
        return (
          <Activity
            key={isActive ? `${index}-${activeIndex}` : index}
            mode={isActive ? "visible" : "hidden"}
          >
            <m.div
              animate="center"
              exit="exit"
              initial="enter"
              transition={transition}
              {...props}
               className={`transition-panel${className ? ` ${className}` : ""}`}
              custom={custom}
              variants={variants}
            >
              {child}
            </m.div>
          </Activity>
        );
      })}
    </AnimatePresence>
  );
};

export { TransitionPanel };
