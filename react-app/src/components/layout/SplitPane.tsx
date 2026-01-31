import { useState, useRef, useEffect } from 'react';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSplit?: number;
  minSplit?: number;
  maxSplit?: number;
}

export function SplitPane({
  left,
  right,
  defaultSplit = 60,
  minSplit = 30,
  maxSplit = 70,
}: SplitPaneProps) {
  const [split, setSplit] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newSplit = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      setSplit(Math.max(minSplit, Math.min(maxSplit, newSplit)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minSplit, maxSplit]);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full overflow-hidden"
      style={{ cursor: isDragging ? 'col-resize' : 'default' }}
    >
      <div
        className="flex flex-col overflow-hidden"
        style={{ width: `${split}%` }}
      >
        {left}
      </div>

      <div
        className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize flex-shrink-0"
        onMouseDown={() => setIsDragging(true)}
      />

      <div
        className="flex flex-col overflow-hidden flex-1"
        style={{ width: `${100 - split}%` }}
      >
        {right}
      </div>
    </div>
  );
}
