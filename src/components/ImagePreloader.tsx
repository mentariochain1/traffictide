'use client';

import React, { useEffect } from 'react';

const imagePaths = [
  '/assets/N.png',
  // Добавьте сюда пути к другим изображениям, которые вы хотите предзагрузить
];

const ImagePreloader: React.FC = () => {
  useEffect(() => {
    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  }, []);

  return null;
};

export default ImagePreloader;