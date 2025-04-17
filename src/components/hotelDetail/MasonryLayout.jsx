import { useEffect, useRef } from "react";
import { Card, Image as MantineImage } from "@mantine/core";

export function MasonryLayout({ images, onImageClick }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const grid = containerRef.current;
    const rowHeight = 20; // Same as grid-auto-rows
    const rowGap = 10; // Same as gap
    const items = grid.querySelectorAll(".masonry-item");

    items.forEach((item) => {
      const content = item.querySelector("img");
      if (content.complete) {
        resizeItem(item, content, rowHeight, rowGap);
      } else {
        content.onload = () => resizeItem(item, content, rowHeight, rowGap);
      }
    });
  }, [images]);

  const resizeItem = (item, image, rowHeight, rowGap) => {
    const height = image.getBoundingClientRect().height;
    const span = Math.ceil(height / (rowHeight + rowGap));
    item.style.gridRowEnd = `span ${span}`;
  };

  return (
    <div
      ref={containerRef}
      className="grid gap-[10px]"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // từ 300px → 250px
        gridAutoRows: "20px",
      }}
    >
      {images.map((image, index) => (
        <Card
          key={index}
          shadow="sm"
          padding="sm"
          radius="md"
          className="cursor-pointer masonry-item overflow-hidden"
          onClick={() => onImageClick(image)}
        >
          <MantineImage
            src={image.url}
            alt={`Image ${index + 1}`}
            radius="md"
            className="w-full h-auto"
          />
        </Card>
      ))}
    </div>
  );
}
