import { useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Group, Text } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";

function ReusableImageUploader({ onUpload, multiple = false, initFiles = [] }) {
  const [files, setFiles] = useState(initFiles);
  const [uploading, setUploading] = useState(false);

  // Dropzone should be disabled if there are files and multiple is false
  const isDropzoneDisabled = !multiple && files.length > 0;

  const handleDrop = async (acceptedFiles) => {
    setUploading(true);
    const uploadedFiles = [];

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "profile-photo");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dasqhz9hy/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        uploadedFiles.push({
          url: data.secure_url,
          id: null,
          type: "ROOM",
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setFiles((prevFiles) =>
      multiple ? [...prevFiles, ...uploadedFiles] : uploadedFiles
    );
    setUploading(false);

    if (onUpload) {
      onUpload(multiple ? [...files, ...uploadedFiles] : uploadedFiles);
    }
  };

  const handleRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    if (onUpload) {
      onUpload(updatedFiles);
    }
  };

  return (
    <div>
      <Dropzone
        onDrop={handleDrop}
        accept={IMAGE_MIME_TYPE}
        multiple={multiple}
        disabled={isDropzoneDisabled}
        className={`border-dashed border-2 ${
          isDropzoneDisabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-blue-500"
        } p-6 rounded-lg transition`}
        loading={uploading}
      >
        <Group position="center" spacing="xl" style={{ pointerEvents: "none" }}>
          {isDropzoneDisabled ? (
            <Text size="sm" color="dimmed" align="center">
              {multiple
                ? "You can upload more images"
                : "Profile image already uploaded. Remove it to upload a new one."}
            </Text>
          ) : (
            <>
              <Dropzone.Accept>
                <IconUpload
                  size={48}
                  color="var(--mantine-color-blue-6)"
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  size={48}
                  color="var(--mantine-color-red-6)"
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  size={48}
                  color="var(--mantine-color-dimmed)"
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="lg" weight={500}>
                  Drag & drop images here or click to select files
                </Text>
                <Text size="sm" color="dimmed" mt={5}>
                  {multiple
                    ? "Attach as many files as you like"
                    : "Select one image for your profile"}
                </Text>
              </div>
            </>
          )}
        </Group>
      </Dropzone>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-md"
          >
            <img
              src={file.url}
              alt="Uploaded preview"
              className="w-full h-48 object-cover rounded-md transition-all duration-200 group-hover:scale-105 group-hover:brightness-90"
            />
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            >
              <IconX size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReusableImageUploader;
