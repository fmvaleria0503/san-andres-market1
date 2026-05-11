import React, { useState, useRef } from 'react';

const ImageUploader = ({ onImagesSelected, maxImages = 5, existingImages = [] }) => {
  const [selectedImages, setSelectedImages] = useState(existingImages);
  const [previews, setPreviews] = useState(existingImages);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);

    // Limitar el número de imágenes
    const availableSlots = maxImages - selectedImages.length;
    const filesToProcess = files.slice(0, availableSlots);

    const newImages = [];
    const newPreviews = [];

    filesToProcess.forEach(file => {
      if (file.type.startsWith('image/')) {
        newImages.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          if (newPreviews.length === filesToProcess.length) {
            setPreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setSelectedImages(prev => [...prev, ...newImages]);

    // Llamar al callback con las nuevas imágenes
    if (onImagesSelected) {
      onImagesSelected([...selectedImages, ...newImages]);
    }
  };

  const removeImage = (index) => {
    const newSelectedImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setSelectedImages(newSelectedImages);
    setPreviews(newPreviews);

    if (onImagesSelected) {
      onImagesSelected(newSelectedImages);
    }
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

      {/* Instrucciones */}
      <p className="text-xs text-gray-500">
        Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB por imagen.
      </p>
    </div>
  );
};

export default ImageUploader;