import { useState, useRef, useCallback, useEffect } from 'react';

export const useBottomSheet = ({ snapPoints: snapPointsInVh, initialSnap = 0 }) => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // vh単位をpx単位に変換
  const snapPoints = snapPointsInVh.map(vh => (vh / 100) * windowHeight);

  const [isDragging, setIsDragging] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(snapPoints[initialSnap]);
  const dragStartRef = useRef({ y: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragStart = useCallback((event) => {
    event.preventDefault();
    setIsDragging(true);
    const y = 'touches' in event ? event.touches[0].clientY : event.clientY;
    dragStartRef.current = { y, height: currentHeight };
  }, [currentHeight]);

  const handleDragMove = useCallback((event) => {
    if (!isDragging) return;
    const y = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const deltaY = y - dragStartRef.current.y;
    const newHeight = dragStartRef.current.height - deltaY;
    
    const clampedHeight = Math.max(snapPoints[0], Math.min(newHeight, snapPoints[snapPoints.length - 1]));
    setCurrentHeight(clampedHeight);
  }, [isDragging, snapPoints]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const closestSnap = snapPoints.reduce((prev, curr) => 
      Math.abs(curr - currentHeight) < Math.abs(prev - currentHeight) ? curr : prev
    );
    setCurrentHeight(closestSnap);
  }, [isDragging, snapPoints, currentHeight]);

  const sheetStyle = {
    height: `${currentHeight}px`,
    transition: isDragging ? 'none' : 'height 0.2s var(--ease-ui)',
  };

  const dragHandlers = {
    onTouchStart: handleDragStart,
    onTouchMove: handleDragMove,
    onTouchEnd: handleDragEnd,
    onMouseDown: handleDragStart,
    onMouseMove: handleDragMove,
    onMouseUp: handleDragEnd,
    onMouseLeave: handleDragEnd,
  };

  return { sheetStyle, dragHandlers };
};