// Animation variants for Framer Motion
// TopoShape Insights - Premium animations library

import { Variants } from 'framer-motion';

// Fade in from bottom with stagger support
export const fadeInUp: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
        },
    },
};

// Stagger children animations
export const staggerChildren: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

// Scale and fade for cards
export const scaleIn: Variants = {
    initial: {
        opacity: 0,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.2,
        },
    },
};

// Slide in from right (for modals/drawers)
export const slideInRight: Variants = {
    initial: {
        x: '100%',
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            damping: 30,
            stiffness: 300,
        },
    },
    exit: {
        x: '100%',
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

// Pulse for anomaly alerts
export const pulse: Variants = {
    initial: {
        scale: 1,
        opacity: 1,
    },
    animate: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

// Spring hover effect
export const hoverScale = {
    hover: {
        scale: 1.05,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 10,
        },
    },
    tap: {
        scale: 0.95,
    },
};

// Glow effect on hover
export const glowOnHover: Variants = {
    initial: {
        filter: 'drop-shadow(0 0 0px rgba(134, 239, 172, 0))',
    },
    hover: {
        filter: 'drop-shadow(0 0 20px rgba(134, 239, 172, 0.5))',
        transition: {
            duration: 0.3,
        },
    },
};

// Toast notification slide in from top
export const toastVariant: Variants = {
    initial: {
        y: -100,
        opacity: 0,
        scale: 0.8,
    },
    animate: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            damping: 20,
            stiffness: 300,
        },
    },
    exit: {
        y: -100,
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.2,
        },
    },
};

// Drawer animation from bottom (mobile)
export const drawerVariant: Variants = {
    initial: {
        y: '100%',
    },
    animate: {
        y: 0,
        transition: {
            type: 'spring',
            damping: 30,
            stiffness: 300,
        },
    },
    exit: {
        y: '100%',
        transition: {
            type: 'spring',
            damping: 30,
            stiffness: 300,
        },
    },
};

// Rotate and fade (for loading indicators)
export const rotateIn: Variants = {
    initial: {
        rotate: -180,
        opacity: 0,
    },
    animate: {
        rotate: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

// Continuous rotation (for loading spinners)
export const spin = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};

// Chart line draw animation
export const drawLine: Variants = {
    initial: {
        pathLength: 0,
        opacity: 0,
    },
    animate: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: {
                duration: 1.5,
                ease: 'easeInOut',
            },
            opacity: {
                duration: 0.3,
            },
        },
    },
};

// Background gradient shift
export const gradientShift: Variants = {
    animate: {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};

// Counter number animation
export const counterUp = {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
    },
};

// Page transition
export const pageTransition: Variants = {
    initial: {
        opacity: 0,
        x: -20,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: {
            duration: 0.3,
        },
    },
};

// Modal backdrop fade
export const modalBackdrop: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.2 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    },
};

// 3D flip card
export const flipCard: Variants = {
    initial: { rotateY: 0 },
    flipped: {
        rotateY: 180,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};
