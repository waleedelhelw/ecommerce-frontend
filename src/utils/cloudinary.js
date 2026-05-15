const CLOUD_NAME = 'VITE_CLOUDINARY_CLOUD_NAME';
const UPLOAD_PRESET = 'VITE_CLOUDINARY_UPLOAD_PRESET';

export function getOptimizedImage(url) {
  if (!url || !url.includes('/upload/')) return url;
  return url.replace('/upload/', '/upload/c_fill,w_400,h_400,g_center/f_auto/q_auto/');
}

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'ecommerce');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url;  // ✅ ده الـ URL اللي هتخزنه في الـ DB
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files) => {
  const uploadPromises = files.map((file) => uploadImage(file));
  const urls = await Promise.all(uploadPromises);
  return urls;  // ✅ array of URLs
};