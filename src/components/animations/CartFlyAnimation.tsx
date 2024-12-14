'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CartFlyAnimationProps {
  productImage: string;
  targetX: number;
  targetY: number;
  onComplete: () => void;
}

export default function CartFlyAnimation({
  productImage,
  targetX,
  targetY,
  onComplete
}: CartFlyAnimationProps) {
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const button = document.getElementById('add-to-cart-button');
    if (button) {
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      setStartPosition({
        x: buttonCenterX - 50, // 50 est la moitié de la largeur de l'image animée
        y: buttonCenterY - 50  // 50 est la moitié de la hauteur de l'image animée
      });
    }
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 1,
        scale: 1,
        x: startPosition.x,
        y: startPosition.y,
        position: 'fixed',
        zIndex: 100,
        width: '100px',
        height: '100px',
      }}
      animate={{
        opacity: [1, 1, 0],
        scale: [1, 0.75, 0.5],
        x: [startPosition.x, startPosition.x, targetX],
        y: [startPosition.y, startPosition.y - 100, targetY],
      }}
      transition={{
        duration: 0.8,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      }}
      onAnimationComplete={onComplete}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-white shadow-lg">
        <Image
          src={productImage}
          alt="Product flying to cart"
          fill
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}
