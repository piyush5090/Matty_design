// src/components/LargeEditor.jsx
import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

const OpenTemp = ({ template }) => {
  const fabricRef = useRef(null);

  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas("large-editor-canvas", {
      height: 600,
      width: 900,
      backgroundColor: "#fff",
    });
    fabricRef.current = canvas;

    // If template has imageUrl, load as background
    if (template?.imageUrl) {
      fabric.Image.fromURL(
        template.imageUrl,
        (img) => {
          img.scaleToWidth(canvas.width);
          img.scaleToHeight(canvas.height);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        },
        { crossOrigin: "anonymous" } // Needed for Cloudinary
      );
    }

    return () => {
      canvas.dispose();
    };
  }, [template]);

  return (
    <div className="flex justify-center">
      <canvas id="large-editor-canvas"></canvas>
    </div>
  );
};

export default OpenTemp;
