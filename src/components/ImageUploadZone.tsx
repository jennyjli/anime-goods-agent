'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, X } from 'lucide-react'

interface ImageUploadZoneProps {
  onImageSelect?: (file: File) => void
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImageSelect,
}) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{
    file: File
    preview: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return

    const file = files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        setSelectedImage({ file, preview })
        onImageSelect?.(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const { files } = e.dataTransfer
    handleFileSelection(files)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files)
  }

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!selectedImage ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center ${
            isDragActive
              ? 'border-blue-500 bg-blue-500/10 scale-105'
              : 'border-dark-border bg-dark-surface hover:border-gray-500 hover:bg-dark-surface/80'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
              animate={isDragActive ? { scale: 1.2 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isDragActive ? 'Drop your image here' : 'Upload an anime image'}
              </h3>
              <p className="text-sm text-gray-400">
                Drag and drop your image, or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>

            <motion.div
              animate={{ y: isDragActive ? -8 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-blue-400 mt-2"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm">Supports anime screenshots & artwork</span>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-2xl overflow-hidden border-2 border-dark-border bg-dark-surface p-6"
        >
          <div className="relative group">
            <img
              src={selectedImage.preview}
              alt="Selected"
              className="w-full h-auto max-h-96 object-cover rounded-xl"
            />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearImage}
              className="absolute top-4 right-4 p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                {selectedImage.file.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              Change Image
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
