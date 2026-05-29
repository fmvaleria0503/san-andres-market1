import React, { useState, useRef } from 'react';

const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const resizeImage = async (file) => {
  try {
    const bitmap = await createImageBitmap(file);
    const maxDimension = 1200;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));

    if (scale === 1) {
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) => {
      canvas.toBlob((result) => resolve(result), 'image/jpeg', 0.75);
    });

    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error resizing image:', error);
    return file;
  }
};

const ImageUploader = ({ onImagesSelected, maxImages = 5, existingImages = [] }) => {
  const [selectedImages, setSelectedImages] = useState(existingImages);
  const [previews, setPreviews] = useState(existingImages);
  const [warning, setWarning] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    const availableSlots = maxImages - selectedImages.length;
    const filesToProcess = files.slice(0, availableSlots);

    if (filesToProcess.length === 0) {
      setWarning(`Ya alcanzaste el límite de ${maxImages} imágenes.`);
      return;
    }

    setWarning('');
    const processed = [];

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) {
        setWarning('Solo se permiten archivos de imagen.');
        continue;
      }

      const resizedFile = file.size > 2.5 * 1024 * 1024 ? await resizeImage(file) : file;
      const preview = await readFileAsDataURL(resizedFile);
      processed.push({ file: resizedFile, preview });
    }

    if (processed.length === 0) {
      event.target.value = null;
      return;
    }

    const newSelectedImages = [...selectedImages, ...processed.map(item => item.file)];
    const newPreviews = [...previews, ...processed.map(item => item.preview)];

    setSelectedImages(newSelectedImages);
    setPreviews(newPreviews);
    onImagesSelected?.(newSelectedImages);
    event.target.value = null;
  };

  const removeImage = (index) => {
    const newSelectedImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setSelectedImages(newSelectedImages);
    setPreviews(newPreviews);
    setWarning('');

    onImagesSelected?.(newSelectedImages);
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imágenes del producto ({selectedImages.length}/{maxImages})
      </label>

      {/* Grid de imágenes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {/* Imágenes existentes */}
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Imagen ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Botón para agregar más imágenes */}
        {selectedImages.length < maxImages && (
          <button
            onClick={openGallery}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm">Agregar imagen</span>
          </button>
        )}
      </div>

      {/* Input oculto para archivos */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {warning && <p className="text-xs text-red-500 mb-2">{warning}</p>}
      <p className="text-xs text-gray-500">
        Formatos permitidos: JPG, PNG, GIF. Las imágenes grandes se comprimen automáticamente a un tamaño manejable.
      </p>
    </div>
  );
};

export default ImageUploader;