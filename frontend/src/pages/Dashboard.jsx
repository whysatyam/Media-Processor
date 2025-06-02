import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ReactCompareSlider } from "react-compare-slider";
import Loader from "../components/Loader";
import Filters from "../components/Filters";
import ywaiLogo from "../assets/ywai.png";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [processedUrl, setProcessedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setProcessedUrl("");
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image or video");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      const blobUrl = URL.createObjectURL(response.data);
      setProcessedUrl(blobUrl);

      toast.success("Processing successful");
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
      <div className="bg-white shadow-md rounded-xl p-10 w-full max-w-2xl flex flex-col items-center">
        <img src={ywaiLogo} alt="Logo" className="h-16 mb-6" />

        <div className="w-full flex justify-center items-center gap-6 mb-2 max-w-xs mx-auto">
          <label
            htmlFor="file-upload"
            className={`cursor-pointer px-4 py-2 rounded select-none flex-1 text-center ${
              file ? "bg-green-500 hover:bg-green-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {file ? "File Selected" : "Choose File"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handleUpload}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex-1"
          >
            Process File
          </button>
        </div>

        <p className="text-gray-500 text-sm mb-6 text-center">
          Supported File Formats - JPG, JPEG, PNG, MP4
        </p>

        {isLoading && <Loader />}

        {previewUrl && processedUrl && (
          <div className="mt-2 w-full flex flex-col items-center">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-xl mx-auto overflow-hidden rounded-xl">
                <ReactCompareSlider
                  itemOne={
                    file.type.startsWith("video/") ? (
                      <video
                        src={previewUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto object-contain"
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Original"
                        className="w-full h-auto object-contain"
                      />
                    )
                  }
                  itemTwo={
                    file.type.startsWith("video/") ? (
                      <video
                        src={processedUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto object-contain"
                      />
                    ) : (
                      <img
                        src={processedUrl}
                        alt="Processed"
                        className="w-full h-auto object-contain"
                      />
                    )
                  }
                  orientation="vertical"
                  className="w-full h-auto"
                  style={{ maxWidth: "100%" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {processedUrl && (
        <div className="mt-8 w-full max-w-2xl">
          <Filters processedUrl={processedUrl} fileType={file?.type} />
        </div>
      )}
    </div>
  );
}