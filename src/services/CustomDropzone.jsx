import { Group, Text } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

function CustomDropzone({
  onDrop,
  onReject,
  maxSize = 5 * 1024 ** 2,
  multiple = true,
}) {
  return (
    <Dropzone
      onDrop={onDrop}
      onReject={onReject}
      maxSize={maxSize}
      accept={IMAGE_MIME_TYPE}
      multiple={multiple}
      className="border-dashed border-2 border-gray-300 p-6 rounded-lg hover:border-blue-500 transition"
    >
      <Group position="center" spacing="xl" style={{ pointerEvents: "none" }}>
        <Dropzone.Accept>
          <IconUpload
            size={48}
            color="var(--mantine-color-blue-6)"
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX size={48} color="var(--mantine-color-red-6)" stroke={1.5} />
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
            Attach as many files as you like, each file should not exceed{" "}
            {maxSize / 1024 ** 2} MB
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}

export default CustomDropzone;
