import imageCompression from "browser-image-compression";

export async function filesToBase64(files: File[]): Promise<string[]> {
  const promises = files.map(
    (file) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      })
  );

  return Promise.all(promises);
}




export async function compressImage(file: File) {

  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1600,
    useWebWorker: true
  };

  return await imageCompression(file, options);
}