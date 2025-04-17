import { AspectRatio } from "@mantine/core";

export function LocationMap({ locationUrl }) {
  return (
    <AspectRatio ratio={16 / 9}>
      <iframe
        src={locationUrl}
        title="Google map"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      />
    </AspectRatio>
  );
}
