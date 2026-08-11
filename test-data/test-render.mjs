import fs from "fs/promises";

const payload = JSON.parse(
  await fs.readFile(new URL("./sample-property.json", import.meta.url))
);

const res = await fetch("http://localhost:4000/api/render-property-video", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Internal-Api-Key": "mOH1gul8a06yskJOQEe9ZYJ+RRY=",
  },
  body: JSON.stringify(payload),
});

const data = await res.json();

if (!res.ok || !data.success) {
  console.error("Render failed:", data);
  process.exit(1);
}

console.log("Video URL:", data.url);
console.log("Thumbnail:", data.thumbnail);