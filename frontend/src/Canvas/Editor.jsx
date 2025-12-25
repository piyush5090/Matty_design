import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Ellipse,
  Line,
  Text,
  Image as KImage,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import jsPDF from "jspdf";
import { useSelector, useDispatch } from "react-redux";
import EditNavbar from "./EditNavbar";
import {
  addShape,
  updateShape,
  clearShapes,
  undo,
  redo,
  removeShape,
  replaceAll,
} from "../store/shapesSlice";
import { fetchDesigns } from "../store/designSlice";
import axiosInstance from "../utils/axiosinstance";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const uid = () =>
  `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const ensureRef = (store, id) => {
  const key = String(id);
  if (!store.current[key]) store.current[key] = React.createRef();
  return store.current[key];
};

const coerceId = (shape) => ({
  ...shape,
  id: String(shape.id ?? shape._id ?? uid()),
});

function KonvaImage({ shape, onSelect, onChange, nodeRef }) {
  const [img] = useImage(shape.src, "anonymous");
  return (
    <KImage
      image={img}
      id={String(shape.id)}
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      draggable
      ref={nodeRef}
      onClick={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={() => {
        const node = nodeRef.current;
        if (!node) return;
        const sx = node.scaleX();
        const sy = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * sx),
          height: Math.max(5, node.height() * sy),
        });
      }}
    />
  );
}

export default function Editor() {
  const { shapes } = useSelector((state) => state.shapes);
  const selectedDesign = useSelector((state) => state.designs.selected);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const query = useQuery();
  const templateId = query.get("templateId");
  const [templateBgUrl, setTemplateBgUrl] = useState("");
  const [stageSize, setStageSize] = useState({ width: 900, height: 600 });

  const stageRef = useRef();
  const transformerRef = useRef();
  const nodeRefs = useRef({});
  const [currentColor, setCurrentColor] = useState("#000000");
  const [isPainting, setIsPainting] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(24);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // Responsive Stage
  useEffect(() => {
    const update = () => {
      const w = Math.min(window.innerWidth - 320, 1200);
      const h = Math.max(400, window.innerHeight - 200);
      setStageSize({ width: w, height: h });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!templateId) return;
    axiosInstance.get(`/api/templates/${templateId}`)
      .then(res => {
        const template = res.data;
        setTemplateBgUrl(template.imageUrl || "");
        if (Array.isArray(template.shapes)) {
          dispatch(replaceAll(template.shapes.map(coerceId)));
        }
      })
      .catch(e => {
        setTemplateBgUrl("");
        dispatch(replaceAll([]));
        console.error("Failed to load template", e);
      });
  }, [templateId, dispatch]);

  useEffect(() => {
    if (selectedDesign) {
      const safe = (selectedDesign.Shapes || []).map(coerceId);
      dispatch(replaceAll(safe));
      setSelectedId(null);
      transformerRef.current?.nodes([]);
    }
  }, [selectedDesign, dispatch]);

  const shapeFactories = {
    rect: (pos) => ({
      type: "rect",
      x: pos?.x ?? Math.random() * 200,
      y: pos?.y ?? Math.random() * 200,
      width: 120,
      height: 80,
      fill: "transparent",
      stroke: currentColor,
      strokeWidth: 2,
      id: uid(),
    }),
    circle: (pos) => ({
      type: "circle",
      x: pos?.x ?? Math.random() * 200,
      y: pos?.y ?? Math.random() * 200,
      radius: 50,
      fill: "transparent",
      stroke: currentColor,
      strokeWidth: 2,
      id: uid(),
    }),
    ellipse: (pos) => ({
      type: "ellipse",
      x: pos?.x ?? Math.random() * 200,
      y: pos?.y ?? Math.random() * 200,
      radiusX: 70,
      radiusY: 40,
      fill: "transparent",
      stroke: currentColor,
      strokeWidth: 2,
      id: uid(),
    }),
    line: (pos) => ({
      type: "line",
      points: pos
        ? [pos.x - 20, pos.y - 20, pos.x + 20, pos.y + 20]
        : [20, 20, 200, 200],
      stroke: currentColor,
      strokeWidth: 3,
      tension: 0.2,
      lineCap: "round",
      id: uid(),
    }),
    triangle: (pos) => ({
      type: "triangle",
      points: pos
        ? [pos.x, pos.y, pos.x + 100, pos.y, pos.x + 50, pos.y - 80]
        : [50, 150, 150, 150, 100, 50],
      fill: "transparent",
      stroke: currentColor,
      strokeWidth: 2,
      id: uid(),
    }),
    text: (pos) => ({
      type: "text",
      x: pos?.x ?? 150,
      y: pos?.y ?? 150,
      text: "New Text",
      fontSize,
      fontFamily,
      fontStyle: `${isItalic ? "italic" : ""} ${isBold ? "bold" : ""}`.trim(),
      fill: currentColor,
      draggable: true,
      id: uid(),
    }),
  };

  const addShapeAt = (factory, pos) => {
    const s = factory(pos);
    dispatch(addShape({ ...s, id: String(s.id) }));
  };

  const handleAddRect = () => addShapeAt(shapeFactories.rect);
  const handleAddCircle = () => addShapeAt(shapeFactories.circle);
  const handleAddEllipse = () => addShapeAt(shapeFactories.ellipse);
  const handleAddLine = () => addShapeAt(shapeFactories.line);
  const handleAddTriangle = () => addShapeAt(shapeFactories.triangle);
  const handleAddText = () => addShapeAt(shapeFactories.text);

  const isDrawing = useRef(false);

  const handleStageMouseDown = (e) => {
    if (isPainting) {
      isDrawing.current = true;
      const pos = stageRef.current.getPointerPosition();
      dispatch(
        addShape({
          type: "line",
          points: [pos.x, pos.y],
          stroke: currentColor,
          strokeWidth: 3,
          tension: 0.2,
          id: uid(),
        })
      );
      return;
    }

    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      transformerRef.current?.nodes([]);
      return;
    }

    const shapeId = e.target?.attrs?.id || e.target?.id?.();
    if (shapeId) {
      setSelectedId(String(shapeId));
      const node = nodeRefs.current[String(shapeId)]?.current;
      if (transformerRef.current && node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  };

  const handleStageMouseMove = () => {
    if (!isDrawing.current || !isPainting) return;
    const pos = stageRef.current.getPointerPosition();
    const last = shapes[shapes.length - 1];
    if (!last || last.type !== "line") return;
    dispatch(
      updateShape({
        id: String(last.id),
        newAttrs: { points: last.points.concat([pos.x, pos.y]) },
      })
    );
  };

  const handleStageMouseUp = () => {
    isDrawing.current = false;
  };

  const selectShape = (id) => {
    const sid = String(id);
    setSelectedId(sid);
    const node = nodeRefs.current[sid]?.current;
    if (node && transformerRef.current) {
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer().batchDraw();
    }
  };

  const handleDragEnd = (id, node) => {
    if (!node) return;
    const className = node.getClassName();
    const base = { x: node.x(), y: node.y() };
    if (className === "Text") {
      base.width = node.width();
      base.height = node.height();
    }
    dispatch(updateShape({ id: String(id), newAttrs: base }));
  };

  const handleTransformEnd = (id, node) => {
    if (!node) return;
    const className = node.getClassName();
    const newAttrs = { x: node.x(), y: node.y(), rotation: node.rotation() };
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    if (["Rect", "Text", "Image"].includes(className)) {
      newAttrs.width = Math.max(5, node.width() * scaleX);
      newAttrs.height = Math.max(5, node.height() * scaleY);
    }
    if (className === "Circle") {
      newAttrs.radius = Math.max(1, node.radius() * scaleX);
    }
    if (className === "Ellipse") {
      newAttrs.radiusX = Math.max(1, node.radiusX() * scaleX);
      newAttrs.radiusY = Math.max(1, node.radiusY() * scaleY);
    }

    node.scaleX(1);
    node.scaleY(1);
    dispatch(updateShape({ id: String(id), newAttrs }));
  };

  const handleDelete = () => {
    if (!selectedId) return;
    dispatch(removeShape(String(selectedId)));
    setSelectedId(null);
    transformerRef.current?.nodes([]);
  };

  const bringForward = () => {
    if (!selectedId) return;
    const idx = shapes.findIndex((s) => String(s.id) === String(selectedId));
    if (idx < shapes.length - 1 && idx >= 0) {
      const newArr = [...shapes];
      [newArr[idx + 1], newArr[idx]] = [newArr[idx], newArr[idx + 1]];
      dispatch(replaceAll(newArr));
    }
  };

  const sendBackward = () => {
    if (!selectedId) return;
    const idx = shapes.findIndex((s) => String(s.id) === String(selectedId));
    if (idx > 0) {
      const newArr = [...shapes];
      [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
      dispatch(replaceAll(newArr));
    }
  };

  const hiddenFileRef = useRef();
  const handleUploadImageClick = () => hiddenFileRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imgData = reader.result;
      dispatch(
        addShape({
          type: "image",
          src: imgData,
          x: 100,
          y: 100,
          width: 300,
          height: 200,
          id: uid(),
        })
      );
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const exportPNG = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "matty_design.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportPDF = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [stageRef.current.width(), stageRef.current.height()],
    });
    pdf.addImage(
      uri,
      "PNG",
      0,
      0,
      stageRef.current.width(),
      stageRef.current.height()
    );
    pdf.save("matty_design.pdf");
  };

  const saveDesign = async () => {
    const storedUser =
      user && user._id
        ? user
        : JSON.parse(sessionStorage.getItem("user") || "{}");
    const userId = storedUser?._id || "";
    const username = storedUser?.username || "";

    let name = prompt("Enter a name for your design:", "Untitled Design");
    if (name === null) return;
    name = name.trim() || "Untitled Design";

    if (!userId || !username) {
      alert("User info missing. Please login and try again.");
      return;
    }
    if (!Array.isArray(shapes) || shapes.length === 0) {
      alert("Please create something on canvas before saving.");
      return;
    }

    const shapesToSave = shapes.map(coerceId);

    let imageData = "";
    try {
      if (stageRef.current) {
        imageData = stageRef.current.toDataURL({
          mimeType: "image/png",
          pixelRatio: 2,
        });
      }
    } catch (e) {
      console.warn("Konva export failed:", e?.message);
    }

    const payload = { Shapes: shapesToSave, name, username, imageData };

    try {
      const res = await axiosInstance.post("/api/designs", payload);
      if (res?.data) {
        dispatch(fetchDesigns(userId));
        alert("Design saved successfully!");
      }
    } catch (error) {
      alert(
        "Failed to save design: " +
          (error?.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    if (!transformerRef.current) return;
    if (!selectedId) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }
    const node = nodeRefs.current[String(selectedId)]?.current;
    if (node) {
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, shapes]);

  useEffect(() => {
    if (!selectedId) return;
    const s = shapes.find((x) => String(x.id) === String(selectedId));
    if (s && s.type === "text") {
      dispatch(
        updateShape({
          id: String(selectedId),
          newAttrs: {
            fontSize,
            fontFamily,
            fontStyle: `${isItalic ? "italic" : ""} ${
              isBold ? "bold" : ""
            }`.trim(),
            fill: currentColor,
          },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontSize, fontFamily, isBold, isItalic, currentColor]);

  // Sidebar component
  function SideNavBar() {
    return (
      <div className="w-72 bg-gray-800 p-4 space-y-4 overflow-auto">
        <h3 className="text-sm font-semibold">Text Controls</h3>
        <div>
          <label className="text-xs">Font</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full p-1 bg-gray-700"
          >
            <option>Arial</option>
            <option>Times New Roman</option>
            <option>Courier New</option>
            <option>Georgia</option>
            <option>Roboto</option>
          </select>
        </div>
        <div>
          <label className="text-xs">Size</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full p-1 bg-gray-700"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsBold((b) => !b)}
            className={`px-2 py-1 ${isBold ? "bg-gray-600" : "bg-gray-700"}`}
          >
            B
          </button>
          <button
            onClick={() => setIsItalic((i) => !i)}
            className={`px-2 py-1 ${isItalic ? "bg-gray-600" : "bg-gray-700"}`}
          >
            I
          </button>
        </div>
        <h3 className="text-sm font-semibold mt-4">Selected Shape</h3>
        <div className="text-xs">
          <div>Selected Id: {selectedId ?? "—"}</div>
          <div>Color:</div>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
          />
        </div>
        <h3 className="text-sm font-semibold mt-4">Image Upload</h3>
        <div>
          <input
            ref={hiddenFileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleUploadImageClick}
            className="px-3 py-1 bg-gray-700"
          >
            Upload Image
          </button>
        </div>
        <h3 className="text-sm font-semibold mt-4">Add Shapes</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleAddRect} className="px-2 py-1 bg-gray-700">Rect</button>
          <button onClick={handleAddCircle} className="px-2 py-1 bg-gray-700">Circle</button>
          <button onClick={handleAddEllipse} className="px-2 py-1 bg-gray-700">Ellipse</button>
          <button onClick={handleAddLine} className="px-2 py-1 bg-gray-700">Line</button>
          <button onClick={handleAddTriangle} className="px-2 py-1 bg-gray-700">Triangle</button>
          <button onClick={handleAddText} className="px-2 py-1 bg-gray-700">Text</button>
        </div>
        <h3 className="text-sm font-semibold mt-4">Save / Export</h3>
        <div className="space-y-2">
          <button
            onClick={saveDesign}
            className="w-full px-3 py-1 bg-gray-700"
          >
            Save Design (JSON)
          </button>
          <button
            onClick={exportPNG}
            className="w-full px-3 py-1 bg-gray-700"
          >
            Export PNG
          </button>
          <button
            onClick={exportPDF}
            className="w-full px-3 py-1 bg-gray-700"
          >
            Export PDF
          </button>
        </div>
      </div>
    );
  }

  function TemplateBackgroundImage() {
    const [image] = useImage(templateBgUrl, "anonymous");
    if (!templateBgUrl || !image) return null;
    return (
      <KImage
        image={image}
        x={0}
        y={0}
        width={stageSize.width}
        height={stageSize.height}
        listening={false}
        perfectDrawEnabled={false}
        globalCompositeOperation="source-over"
      />
    );
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <EditNavbar
        onRect={handleAddRect}
        onCircle={handleAddCircle}
        onEllipse={handleAddEllipse}
        onLine={handleAddLine}
        onTriangle={handleAddTriangle}
        onText={handleAddText}
        onClear={() => {
          dispatch(clearShapes());
          setSelectedId(null);
          transformerRef.current?.nodes([]);
        }}
        onUndo={() => dispatch(undo())}
        onRedo={() => dispatch(redo())}
        onColorChange={setCurrentColor}
        onPaintToggle={() => setIsPainting((v) => !v)}
        isPainting={isPainting}
        onExportPNG={exportPNG}
        onExportPDF={exportPDF}
        onDelete={handleDelete}
        onBringForward={bringForward}
        onSendBackward={sendBackward}
        onSaveDesign={saveDesign}
        onUploadImageClick={handleUploadImageClick}
      />
      <div className="flex flex-1 overflow-hidden">
        <SideNavBar />
        <div className="flex-1 flex justify-center items-start p-4 overflow-auto">
          <div
            className="bg-white p-2 rounded"
            style={{ boxShadow: "0 0 0 2px #1f2937" }}
          >
            <Stage
              width={stageSize.width}
              height={stageSize.height}
              ref={stageRef}
              onMouseDown={handleStageMouseDown}
              onMouseMove={handleStageMouseMove}
              onMouseUp={handleStageMouseUp}
              style={{ background: "#fff" }}
            >
              <Layer>
                {/* Background image */}
                <TemplateBackgroundImage />
                {/* All shapes on top */}
                {shapes?.map((shape) => {
                  const id = String(shape.id);
                  const ref = ensureRef(nodeRefs, id);
                  switch (shape.type) {
                    case "rect":
                      return (
                        <Rect
                          key={id}
                          id={id}
                          {...shape}
                          ref={ref}
                          draggable
                          onClick={() => selectShape(id)}
                          onDragEnd={() => handleDragEnd(id, ref.current)}
                          onTransformEnd={() =>
                            handleTransformEnd(id, ref.current)
                          }
                        />
                      );
                    case "circle":
                      return (
                        <Circle
                          key={id}
                          id={id}
                          {...shape}
                          ref={ref}
                          draggable
                          onClick={() => selectShape(id)}
                          onDragEnd={() => handleDragEnd(id, ref.current)}
                          onTransformEnd={() =>
                            handleTransformEnd(id, ref.current)
                          }
                        />
                      );
                    case "ellipse":
                      return (
                        <Ellipse
                          key={id}
                          id={id}
                          {...shape}
                          ref={ref}
                          draggable
                          onClick={() => selectShape(id)}
                          onDragEnd={() => handleDragEnd(id, ref.current)}
                          onTransformEnd={() =>
                            handleTransformEnd(id, ref.current)
                          }
                        />
                      );
                    case "line":
                      return (
                        <Line
                          key={id}
                          id={id}
                          {...shape}
                          ref={ref}
                          draggable
                          onClick={() => selectShape(id)}
                          onDragEnd={() => handleDragEnd(id, ref.current)}
                          onTransformEnd={() =>
                            handleTransformEnd(id, ref.current)
                          }
                        />
                      );
                    case "triangle":
                      return (
                        <Line
                          key={id}
                          id={id}
                          {...shape}
                          closed
                          ref={ref}
                          draggable
                          onClick={() => selectShape(id)}
                          onDragEnd={() => handleDragEnd(id, ref.current)}
                          onTransformEnd={() =>
                            handleTransformEnd(id, ref.current)
                          }
                        />
                      );
                    case "text":
                      return (
                        <Text
                          key={id}
                          id={id}
                          {...shape}
                          draggable
                          ref={ref}
                          onClick={() => selectShape(id)}
                          onDragEnd={() => handleDragEnd(id, ref.current)}
                          onTransformEnd={() =>
                            handleTransformEnd(id, ref.current)
                          }
                          onDblClick={() => {
                            const newText = prompt("Edit text:", shape.text);
                            if (newText !== null) {
                              dispatch(
                                updateShape({
                                  id,
                                  newAttrs: { text: newText },
                                })
                              );
                            }
                          }}
                        />
                      );
                    case "image":
                      return (
                        <KonvaImage
                          key={id}
                          shape={{ ...shape, id }}
                          nodeRef={ref}
                          onSelect={() => selectShape(id)}
                          onChange={(newAttrs) =>
                            dispatch(updateShape({ id, newAttrs }))
                          }
                        />
                      );
                    default:
                      return null;
                  }
                })}
                <Transformer ref={transformerRef} rotateEnabled />
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
}
