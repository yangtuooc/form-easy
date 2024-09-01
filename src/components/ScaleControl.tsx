import React from "react";
import { Slider } from "./ui/slider";

interface ScaleControlProps {
  scale: number;
  setScale: (scale: number) => void;
}

const ScaleControl: React.FC<ScaleControlProps> = ({ scale, setScale }) => {
  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">缩放</h3>
      <Slider
        min={0.5}
        max={3}
        step={0.1}
        value={[scale]}
        onValueChange={handleScaleChange}
      />
      <div className="mt-1 text-xs text-muted-foreground">
        {scale.toFixed(1)}x
      </div>
    </div>
  );
};

export default ScaleControl;
