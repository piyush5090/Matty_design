import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { fabric } from "fabric";
import axiosInstance from "../utils/axiosinstance";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Editor() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [designName, setDesignName] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const query = useQuery();
  const templateId = query.get("templateId");

  // Load template shapes if templateId is present
  useEffect(() => {
    if (templateId) {
      axiosInstance.get(`/api/templates/${templateId}`)
        .then(res => {
          const template = res.data;
          setDesignName(template.name || "");
          if (canvas && Array.isArray(template.shapes)) {
            canvas.clear();
            // Restore each shape
            template.shapes.forEach(shapeObj => {
              canvas.add(fabric.util.enlivenObjects([shapeObj], (objects) => {
                objects.forEach(obj => canvas.add(obj));
              }));
            });
            canvas.renderAll();
          }
        })
        .catch(e => {
          console.error("Failed to load template", e);
        });
    }
    // eslint-disable-next-line
  }, [templateId, canvas]);

  useEffect(() => {
    const c = new fabric.Canvas(canvasRef.current, { height: 600, width: 800, backgroundColor: "#fff" });
    setCanvas(c);
    return () => {
      c.dispose();
    };
  }, []);

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox("Type here", { left: 50, top: 50 });
    canvas.add(text);
  };

  const saveDesign = async () => {
    let storedUser = user && user._id ? user : null;
    if (!storedUser) {
      try {
        storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      } catch {
        storedUser = {};
      }
    }
    const userId = storedUser?._id || "";
    const username = storedUser?.username || "";

    let name = prompt("Enter a name for your design:", designName || "Untitled Design");
    if (name === null) return;
    name = name.trim() || "Untitled Design";

    // extract all shapes as JSON
    const shapes = canvas ? canvas.getObjects().map(obj => obj.toObject()) : [];

    const payload = {
      Shapes: shapes,
      name,
      createdBy: userId,
      username
    };

    if (!userId || !username) {
      alert("User info missing – please login and try again.");
      return;
    }
    if (!payload.Shapes.length) {
      alert("Please create something on canvas before saving.");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/designs", payload);
      if (res?.data) {
        alert("Design saved successfully!");
      }
    } catch (error) {
      console.error("Error saving design:", error?.response?.data || error.message);
      alert("Failed to save design: " + (error?.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <input
        value={designName}
        onChange={e => setDesignName(e.target.value)}
        placeholder="Design Name"
      />
      <button onClick={addText}>Add Text</button>
      <button onClick={saveDesign}>Save</button>
      <canvas ref={canvasRef} />
    </div>
  );
}
