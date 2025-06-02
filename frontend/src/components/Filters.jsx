import React, { useEffect, useRef, useState } from "react";

export default function Filters({ processedUrl, fileType }) {
  const [brightness, setBrightness] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [contrast, setContrast] = useState(0);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (fileType.startsWith("image/") && imageRef.current?.complete) {
      applyFilters();
    }
  }, [brightness, contrast, sharpness]);

  const applyFilters = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    const bFactor = (brightness + 100) / 100;
    const cFactor = (contrast + 100) / 100;

    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        data[i + j] = truncate((data[i + j] - 128) * cFactor + 128);
        data[i + j] = truncate(data[i + j] * bFactor);
      }
    }

    imageData.data.set(data);
    ctx.putImageData(imageData, 0, 0);

    if (sharpness !== 0) {
      applySharpness(canvas, ctx, sharpness);
    }
  };

  const applySharpness = (canvas, ctx, sharpness) => {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const copy = new Uint8ClampedArray(data);

    const kernel = sharpness > 0
      ? [
          0, -1, 0,
         -1, 5, -1,
          0, -1, 0
        ]
      : [
          1 / 9, 1 / 9, 1 / 9,
          1 / 9, 1 / 9, 1 / 9,
          1 / 9, 1 / 9, 1 / 9
        ];

    const intensity = Math.abs(sharpness) / 100;

    const getIndex = (x, y, c) => (y * width + x) * 4 + c;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const px = x + kx;
              const py = y + ky;
              const i = getIndex(px, py, c);
              const weight = kernel[(ky + 1) * 3 + (kx + 1)];
              sum += copy[i] * weight;
            }
          }
          const i = getIndex(x, y, c);
          data[i] = truncate(copy[i] + (sum - copy[i]) * intensity);
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const truncate = (value) => Math.max(0, Math.min(255, value));

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl flex flex-col items-center">
      {fileType.startsWith("image/") && (
        <>
          <img
            src={processedUrl}
            ref={imageRef}
            alt="Processed"
            style={{ display: "none" }}
            onLoad={applyFilters}
          />
          <canvas ref={canvasRef} className="rounded-xl w-full h-auto" />
        </>
      )}

      {fileType.startsWith("video/") && (
        <video
          ref={videoRef}
          src={processedUrl}
          controls
          className="rounded-xl w-full h-auto mt-2"
          style={{
            filter: `
              brightness(${(brightness + 100) / 100})
              contrast(${(contrast + 100) / 100})
              ${sharpness !== 0 ? 'drop-shadow(0 0 1px rgba(0,0,0,0.6))' : ''}
            `,
            transform: sharpness !== 0 ? 'scale(1.001)' : 'none'
          }}
        />
      )}

      <div className="w-full mt-6 space-y-4">
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Brightness</label>
          <input
            type="range"
            min="-100"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Sharpness</label>
          <input
            type="range"
            min="-100"
            max="100"
            value={sharpness}
            onChange={(e) => setSharpness(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Contrast</label>
          <input
            type="range"
            min="-100"
            max="100"
            value={contrast}
            onChange={(e) => setContrast(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}