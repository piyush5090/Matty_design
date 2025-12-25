// src/components/EditNavbar.jsx
import React from "react";
import {
  FaShapes,
  FaCircle,
  FaDrawPolygon,
  FaSlash,
  FaFont,
  FaEraser,
  FaUndo,
  FaRedo,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaUpload,
  FaPaintBrush,
  FaImage,
  FaFilePdf,
  FaSave,
} from "react-icons/fa";

export default function EditNavbar({
  onRect,
  onCircle,
  onEllipse,
  onLine,
  onTriangle,
  onText,
  onClear,
  onUndo,
  onRedo,
  onColorChange,
  onPaintToggle,
  isPainting,
  onExportPNG,
  onExportPDF,
  onDelete,
  onBringForward,
  onSendBackward,
  onSaveDesign,
  onUploadImageClick,
}) {
  return (
    <div className="bg-gray-900 text-gray-100 shadow-sm w-full">
      <div className="flex items-center space-x-3 px-4 py-2 overflow-x-auto">
        {/* Rectangle */}
        <button
          onClick={onRect}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Rectangle"
        >
          <FaShapes />
          <span className="text-xs mt-1">Rectangle</span>
        </button>
        {/* Circle */}
        <button
          onClick={onCircle}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Circle"
        >
          <FaCircle />
          <span className="text-xs mt-1">Circle</span>
        </button>
        {/* Ellipse */}
        <button
          onClick={onEllipse}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Ellipse"
        >
          <span className="text-lg">◯</span>
          <span className="text-xs mt-1">Ellipse</span>
        </button>
        {/* Line */}
        <button
          onClick={onLine}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Line"
        >
          <FaSlash />
          <span className="text-xs mt-1">Line</span>
        </button>
        {/* Triangle */}
        <button
          onClick={onTriangle}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Triangle"
        >
          <FaDrawPolygon />
          <span className="text-xs mt-1">Triangle</span>
        </button>

        {/* Text */}
        <button
          onClick={onText}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Text"
        >
          <FaFont />
          <span className="text-xs mt-1">Text</span>
        </button>

        {/* Color Picker */}
        <div className="flex flex-col items-center">
          <input
            type="color"
            onChange={(e) => onColorChange(e.target.value)}
            className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
            title="Pick Color"
          />
          <span className="text-xs mt-1">Color</span>
        </div>

        {/* Paint/Brush */}
        <button
          onClick={onPaintToggle}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Brush"
        >
          <FaPaintBrush />
          <span className="text-xs mt-1">Brush</span>
        </button>

        {/* Clear */}
        <button
          onClick={onClear}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Clear Canvas"
        >
          <FaEraser />
          <span className="text-xs mt-1">Clear</span>
        </button>

        {/* Undo */}
        <button
          onClick={onUndo}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Undo"
        >
          <FaUndo />
          <span className="text-xs mt-1">Undo</span>
        </button>
        {/* Redo */}
        <button
          onClick={onRedo}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Redo"
        >
          <FaRedo />
          <span className="text-xs mt-1">Redo</span>
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Delete"
        >
          <FaTrash />
          <span className="text-xs mt-1">Delete</span>
        </button>

        {/* Layer: Bring Forward */}
        <button
          onClick={onBringForward}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Bring Forward"
        >
          <FaArrowUp />
          <span className="text-xs mt-1">Forward</span>
        </button>
        {/* Layer: Send Backward */}
        <button
          onClick={onSendBackward}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Send Backward"
        >
          <FaArrowDown />
          <span className="text-xs mt-1">Backward</span>
        </button>

        {/* Upload Image */}
        <button
          onClick={onUploadImageClick}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Upload Image"
        >
          <FaUpload />
          <span className="text-xs mt-1">Upload</span>
        </button>

        {/* Export PNG */}
        <button
          onClick={onExportPNG}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Export PNG"
        >
          <FaImage />
          <span className="text-xs mt-1">PNG</span>
        </button>

        {/* Export PDF */}
        <button
          onClick={onExportPDF}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Export PDF"
        >
          <FaFilePdf />
          <span className="text-xs mt-1">PDF</span>
        </button>

        {/* Save */}
        <button
          onClick={onSaveDesign}
          className="flex flex-col items-center px-2 py-1 hover:text-red-400"
          title="Save Design"
        >
          <FaSave />
          <span className="text-xs mt-1">Save</span>
        </button>
      </div>
    </div>
  );
}
