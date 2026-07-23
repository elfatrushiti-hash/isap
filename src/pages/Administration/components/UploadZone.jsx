import { useRef, useState } from 'react'
import { FileUp, UploadCloud } from 'lucide-react'
import { SUPPORTED_ASSET_EXTENSIONS, validateAsset } from '../../../services/assetService.js'

export default function UploadZone({ onUpload, disabled = false }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState([])

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length || disabled) return
    const validFiles = []
    const nextErrors = []
    files.forEach((file) => {
      const validation = validateAsset(file)
      if (validation.valid) validFiles.push(file)
      else nextErrors.push(validation.error)
    })
    setErrors(nextErrors)
    if (validFiles.length) await onUpload(validFiles)
    if (inputRef.current) inputRef.current.value = ''
  }

  const onDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    handleFiles(event.dataTransfer.files)
  }

  return (
    <div>
      <div
        className={`admin-upload-zone ${dragActive ? 'is-dragging' : ''}`}
        onDragEnter={(event) => { event.preventDefault(); setDragActive(true) }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragActive(false) }}
        onDrop={onDrop}
      >
        <UploadCloud size={34} />
        <strong>Drop sales assets here</strong>
        <p>PowerPoint, PDF, Word, Excel, PNG, JPG and MP4. Multiple files are supported, up to 250 MB each.</p>
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={SUPPORTED_ASSET_EXTENSIONS.map((extension) => `.${extension}`).join(',')}
          onChange={(event) => handleFiles(event.target.files)}
        />
        <button type="button" className="admin-primary-button" onClick={() => inputRef.current?.click()} disabled={disabled}>
          <FileUp size={16} /> Browse files
        </button>
      </div>
      {errors.length > 0 && <div className="admin-upload-errors" role="alert">{errors.map((error) => <span key={error}>{error}</span>)}</div>}
    </div>
  )
}
