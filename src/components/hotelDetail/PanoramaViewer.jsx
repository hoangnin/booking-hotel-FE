import React, { useRef, useEffect, useState } from "react";
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers";
import { GyroscopePlugin } from "photo-sphere-viewer/dist/plugins/gyroscope";
import { StereoPlugin } from "photo-sphere-viewer/dist/plugins/stereo";
import "photo-sphere-viewer/dist/plugins/markers.css";

// Ảnh 360° mẫu đã biết hoạt động
const SAMPLE_PANORAMA_URL = "https://pannellum.org/images/cerro-toco-0.jpg";

/**
 * Professional 360° Panorama Viewer inspired by 360cities.net
 * Uses Photo Sphere Viewer library
 *
 * @param {Object} props
 * @param {string} props.imageUrl - URL of the 360° panorama image
 * @returns {JSX.Element}
 */
export function PanoramaViewer({ imageUrl }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewMode, setViewMode] = useState("normal");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useSampleImage, setUseSampleImage] = useState(false);

  // Chọn URL ảnh để sử dụng
  const effectiveImageUrl = useSampleImage ? SAMPLE_PANORAMA_URL : imageUrl;

  // Log for debugging
  useEffect(() => {
    console.log("PanoramaViewer: Image URL =", imageUrl);

    // Validate URL
    if (!imageUrl) {
      console.error("PanoramaViewer: No image URL provided");
      setHasError(true);
      setErrorMessage("Không có URL ảnh 360°");
      setIsLoaded(true);
      return;
    }

    // Check if URL is accessible (can't be done directly due to CORS)
    const img = new Image();
    img.onload = () => {
      console.log("PanoramaViewer: Image pre-loaded successfully");
    };
    img.onerror = () => {
      console.error("PanoramaViewer: Image failed to load in pre-check");
      // Continue anyway as the viewer might handle some errors
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Initialize the viewer
  useEffect(() => {
    if (!containerRef.current || !effectiveImageUrl) return;

    console.log(
      "PanoramaViewer: Initializing viewer with container:",
      containerRef.current
    );
    console.log("PanoramaViewer: Using image URL:", effectiveImageUrl);

    // Only initialize once
    if (viewerRef.current) {
      console.log("PanoramaViewer: Destroying previous viewer instance");
      viewerRef.current.destroy();
    }

    setIsLoaded(false);
    setHasError(false);

    try {
      // Configure plugins
      const plugins = [];

      // Only add plugins if they're available
      try {
        plugins.push([MarkersPlugin, {}]);
        console.log("PanoramaViewer: Added MarkersPlugin");
      } catch (e) {
        console.warn("PanoramaViewer: Failed to add MarkersPlugin", e);
      }

      try {
        plugins.push([GyroscopePlugin, {}]);
        console.log("PanoramaViewer: Added GyroscopePlugin");
      } catch (e) {
        console.warn("PanoramaViewer: Failed to add GyroscopePlugin", e);
      }

      try {
        plugins.push([StereoPlugin, {}]);
        console.log("PanoramaViewer: Added StereoPlugin");
      } catch (e) {
        console.warn("PanoramaViewer: Failed to add StereoPlugin", e);
      }

      console.log(
        "PanoramaViewer: Creating new viewer instance with image:",
        effectiveImageUrl
      );

      // Create the viewer with basic options
      viewerRef.current = new Viewer({
        container: containerRef.current,
        panorama: effectiveImageUrl,
        caption: "Khám phá không gian 360°",
        navbar: ["autorotate", "zoom", "move", "fullscreen"],
        defaultZoomLvl: 0,
        maxFov: 100,
        minFov: 30,
        moveSpeed: 1,
        mousewheel: true,
        mousemove: true,
        autorotateDelay: 2000,
        autorotateSpeed: "2rpm",
      });

      console.log("PanoramaViewer: Viewer created, adding event listeners");

      // Event listeners
      viewerRef.current.on("ready", () => {
        console.log("PanoramaViewer: Panorama loaded successfully");
        setIsLoaded(true);
      });

      viewerRef.current.on("error", (e) => {
        console.error("PanoramaViewer: Error event from viewer", e);
        setHasError(true);
        setErrorMessage(e.message || "Lỗi khi tải ảnh 360°");
        setIsLoaded(true);
      });

      viewerRef.current.on("fullscreen-updated", (e) => {
        console.log("PanoramaViewer: Fullscreen updated", e.fullscreen);
        setIsFullscreen(e.fullscreen);
      });

      // Cleanup on unmount
      return () => {
        if (viewerRef.current) {
          console.log("PanoramaViewer: Cleaning up");
          viewerRef.current.destroy();
        }
      };
    } catch (error) {
      console.error(
        "PanoramaViewer: Error initializing panorama viewer:",
        error
      );
      setHasError(true);
      setErrorMessage(error.message || "Lỗi khởi tạo trình xem 360°");
      setIsLoaded(true);
    }
  }, [effectiveImageUrl, useSampleImage]);

  // Handle view mode changes
  useEffect(() => {
    if (!viewerRef.current || hasError) return;

    console.log("PanoramaViewer: Changing view mode to", viewMode);

    let stereoPlugin;

    try {
      switch (viewMode) {
        case "fisheye":
          viewerRef.current.setOption("fisheye", true);
          break;
        case "little-planet":
          viewerRef.current.setOption("fisheye", true);
          viewerRef.current.rotate({ x: -Math.PI / 2, zoom: 5 });
          break;
        case "stereo":
          stereoPlugin = viewerRef.current.getPlugin(StereoPlugin);
          if (stereoPlugin) stereoPlugin.toggle();
          break;
        default:
          viewerRef.current.setOption("fisheye", false);
          break;
      }
    } catch (error) {
      console.error("PanoramaViewer: Error changing view mode:", error);
      // Don't set hasError here to avoid breaking the viewer
    }
  }, [viewMode, hasError]);

  // Change view mode
  const handleViewModeChange = (mode) => {
    console.log("PanoramaViewer: User requested view mode change to", mode);
    setViewMode(mode);
  };

  // Toggle between user image and sample image
  const toggleSampleImage = () => {
    setUseSampleImage(!useSampleImage);
  };

  // Fallback component when there's an error
  const renderFallback = () => {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundColor: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>Không thể hiển thị ảnh 360°</h3>
          <p style={{ margin: 0 }}>
            {errorMessage || "Thử tải lại trang hoặc kiểm tra URL ảnh"}
          </p>
        </div>

        {imageUrl && (
          <div style={{ width: "80%", maxWidth: "600px", textAlign: "center" }}>
            <p style={{ marginBottom: "10px", fontSize: "14px" }}>
              Xem ảnh chế độ thường:
            </p>
            <img
              src={imageUrl}
              alt="Ảnh thường thay vì ảnh 360°"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                objectFit: "contain",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "4px",
              }}
            />
          </div>
        )}

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            onClick={() => {
              if (viewerRef.current) viewerRef.current.destroy();
              setHasError(false);
              setIsLoaded(false);

              // Try to reinitialize with a delay
              setTimeout(() => {
                if (containerRef.current && effectiveImageUrl) {
                  try {
                    viewerRef.current = new Viewer({
                      container: containerRef.current,
                      panorama: effectiveImageUrl,
                    });

                    viewerRef.current.on("ready", () => {
                      setIsLoaded(true);
                    });

                    viewerRef.current.on("error", () => {
                      setHasError(true);
                    });
                  } catch (e) {
                    console.error(
                      "PanoramaViewer: Error in retry initialization",
                      e
                    );
                    setHasError(true);
                  }
                }
              }, 1000);
            }}
            style={{
              backgroundColor: "#2196F3",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Thử lại
          </button>

          <button
            onClick={toggleSampleImage}
            style={{
              backgroundColor: "#ff9800",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {useSampleImage ? "Ảnh thật" : "Ảnh mẫu"}
          </button>
        </div>
      </div>
    );
  };

  // If there's an error, show the fallback UI
  if (hasError) {
    return renderFallback();
  }

  return (
    <div
      className="panorama-viewer-container"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {/* Loader */}
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "#fff",
            zIndex: 10,
          }}
        >
          <div>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              Đang tải không gian 360°...
            </div>
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "3px solid rgba(255,255,255,0.3)",
                borderTop: "3px solid #fff",
                borderRadius: "50%",
                margin: "0 auto",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        </div>
      )}

      {/* Image source info */}
      {isLoaded && !hasError && useSampleImage && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            backgroundColor: "rgba(255,152,0,0.8)",
            color: "#fff",
            padding: "4px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
          }}
        >
          Đang hiển thị ảnh mẫu
        </div>
      )}

      {/* View mode selector */}
      {isLoaded && !hasError && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 5,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "8px",
            padding: "5px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <button
            onClick={() => handleViewModeChange("normal")}
            style={{
              backgroundColor:
                viewMode === "normal" ? "#2196F3" : "rgba(0,0,0,0.4)",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Chế độ thường
          </button>
          <button
            onClick={() => handleViewModeChange("fisheye")}
            style={{
              backgroundColor:
                viewMode === "fisheye" ? "#2196F3" : "rgba(0,0,0,0.4)",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Chế độ Fisheye
          </button>
          <button
            onClick={() => handleViewModeChange("little-planet")}
            style={{
              backgroundColor:
                viewMode === "little-planet" ? "#2196F3" : "rgba(0,0,0,0.4)",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Little Planet
          </button>
          <button
            onClick={() => handleViewModeChange("stereo")}
            style={{
              backgroundColor:
                viewMode === "stereo" ? "#2196F3" : "rgba(0,0,0,0.4)",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Chế độ VR
          </button>

          <button
            onClick={toggleSampleImage}
            style={{
              backgroundColor: useSampleImage ? "#ff9800" : "rgba(0,0,0,0.4)",
              color: "#fff",
              border: "none",
              marginTop: "10px",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {useSampleImage ? "Ảnh thật" : "Ảnh mẫu"}
          </button>
        </div>
      )}

      {/* Debug information */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "#fff",
          padding: "10px",
          borderRadius: "4px",
          fontSize: "12px",
          maxWidth: "300px",
          display: "block",
        }}
      >
        <div>
          <strong>Debug:</strong>
        </div>
        <div>
          URL:{" "}
          {effectiveImageUrl
            ? effectiveImageUrl.substring(0, 30) + "..."
            : "none"}
        </div>
        <div>Loaded: {isLoaded ? "Yes" : "No"}</div>
        <div>Has error: {hasError ? "Yes" : "No"}</div>
        <div>Mode: {viewMode}</div>
        <div>Using sample: {useSampleImage ? "Yes" : "No"}</div>
      </div>

      {/* Viewer container */}
      <div
        ref={containerRef}
        id="panorama-container"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Instructions */}
      {isLoaded && !isFullscreen && !hasError && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
          }}
        >
          Kéo chuột để xoay • Di chuột + Shift để zoom • Di chuột + Ctrl để
          nghiêng
        </div>
      )}
    </div>
  );
}
