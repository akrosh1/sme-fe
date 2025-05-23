'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import upload, { UploadResponse } from '@/utils/uploadFile';
import { AlertCircle, CheckCircle, FileIcon, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FileItem {
  file: File;
  id: string;
  progress: number;
  status: FileStatus;
  error?: string | string[];
  imageUrl?: string;
  uploadResponse?: UploadResponse;
}

interface FileUploadProps {
  accept?: string;
  maxFileSize?: number;
  multiple?: boolean;
  onChange?: (files: FileList | React.ChangeEvent<HTMLInputElement>) => void;
  onUploadComplete?: (
    response: UploadResponse | UploadResponse[] | null,
  ) => void;
  onUploadError?: (error: any) => void;
  autoUpload?: boolean;
  isProtected?: boolean;
  className?: string;
}

export function FileUpload({
  accept,
  maxFileSize = 10 * 1024 * 1024,
  multiple = false,
  onChange,
  onUploadComplete,
  onUploadError,
  autoUpload = true,
  isProtected = true,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createFileItem = useCallback((file: File): FileItem => {
    const isImage = file.type.startsWith('image/');
    const validationErrors = validateFile(file);

    return {
      file,
      id: crypto.randomUUID(),
      progress: 0,
      status: validationErrors.length > 0 ? 'error' : 'idle',
      imageUrl: isImage ? URL.createObjectURL(file) : undefined,
      error:
        validationErrors.length > 0 ? validationErrors.join(', ') : undefined,
    };
  }, []);

  const handleFileChange = useCallback(
    async (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      const fileArray = Array.from(selectedFiles);

      // If not multiple, only take the first file and clear existing files
      const filesToProcess = multiple ? fileArray : [fileArray[0]];
      const newFiles = filesToProcess.map(createFileItem);

      // Call onChange callback with the file input event
      if (onChange) {
        const mockEvent = {
          target: { files: selectedFiles },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(mockEvent);
      }

      if (multiple) {
        setFiles((prev) => [...prev, ...newFiles]);
      } else {
        // Clear previous files if single upload
        setFiles(newFiles);
      }

      // Auto upload if enabled
      if (autoUpload) {
        const validFiles = newFiles.filter((f) => f.status !== 'error');
        if (validFiles.length > 0) {
          await uploadFiles(validFiles);
        }
      }
    },
    [multiple, onChange, autoUpload, createFileItem],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      handleFileChange(droppedFiles);
    },
    [handleFileChange],
  );

  const uploadSingleFile = async (
    fileItem: FileItem,
  ): Promise<UploadResponse | null> => {
    // Update file status to uploading
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.id === fileItem.id ? { ...f, status: 'uploading', progress: 0 } : f,
      ),
    );

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles((prevFiles) =>
          prevFiles.map((f) => {
            if (f.id === fileItem.id && f.progress < 90) {
              return { ...f, progress: f.progress + 10 };
            }
            return f;
          }),
        );
      }, 200);

      const response = await upload([fileItem.file], {
        multiple: false,
        isProtected,
        setLoading: setIsUploading,
        onChange: (uploadResponse, error) => {
          clearInterval(progressInterval);

          if (error) {
            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.id === fileItem.id
                  ? {
                      ...f,
                      status: 'error',
                      error: error.message || 'Upload failed',
                      progress: 0,
                    }
                  : f,
              ),
            );
            toast.error(error.message || 'Upload failed');
            onUploadError?.(error);
          } else {
            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.id === fileItem.id
                  ? {
                      ...f,
                      status: 'success',
                      progress: 100,
                      uploadResponse: uploadResponse as UploadResponse,
                    }
                  : f,
              ),
            );
            toast.success('File uploaded successfully');
          }
        },
      });

      return response as UploadResponse;
    } catch (error: any) {
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === fileItem.id
            ? {
                ...f,
                status: 'error',
                error: error.message || 'Upload failed',
                progress: 0,
              }
            : f,
        ),
      );
      toast.error(error.message || 'Upload failed');
      onUploadError?.(error);
      return null;
    }
  };

  const uploadFiles = async (filesToUpload: FileItem[]) => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);

    try {
      if (multiple && filesToUpload.length > 1) {
        // Upload multiple files
        const uploadPromises = filesToUpload.map(uploadSingleFile);
        const responses = await Promise.all(uploadPromises);
        const successfulResponses = responses.filter(
          Boolean,
        ) as UploadResponse[];

        if (successfulResponses.length > 0) {
          onUploadComplete?.(successfulResponses);
        }
      } else {
        // Upload single file
        const response = await uploadSingleFile(filesToUpload[0]);
        if (response) {
          onUploadComplete?.(response);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = useCallback((id: string) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((f) => f.id === id);
      if (fileToRemove?.imageUrl) {
        URL.revokeObjectURL(fileToRemove.imageUrl);
      }
      return prevFiles.filter((f) => f.id !== id);
    });
  }, []);

  const uploadAllFiles = useCallback(() => {
    const filesToUpload = files.filter((f) => f.status === 'idle');
    if (filesToUpload.length > 0) {
      uploadFiles(filesToUpload);
    }
  }, [files]);

  const retryUpload = useCallback((fileItem: FileItem) => {
    uploadSingleFile(fileItem);
  }, []);

  const clearAllFiles = useCallback(() => {
    files.forEach((file) => {
      if (file.imageUrl) {
        URL.revokeObjectURL(file.imageUrl);
      }
    });
    setFiles([]);
  }, [files]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
  };

  const validateFile = (file: File) => {
    const errors: string[] = [];

    // Check file size
    if (file.size > maxFileSize) {
      errors.push(`File size exceeds ${formatFileSize(maxFileSize)}`);
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(',').map((type) => type.trim());
      const isValidType = acceptedTypes.some((acceptedType) => {
        if (acceptedType.startsWith('.')) {
          return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
        } else if (acceptedType.includes('/*')) {
          const baseType = acceptedType.split('/')[0];
          return file.type.startsWith(baseType + '/');
        } else {
          return file.type === acceptedType;
        }
      });

      if (!isValidType) {
        errors.push(`File type not accepted. Accepted types: ${accept}`);
      }
    }

    return errors;
  };

  // Get uploaded files data
  const getUploadedFiles = useCallback(() => {
    return files
      .filter((f) => f.status === 'success' && f.uploadResponse)
      .map((f) => f.uploadResponse!);
  }, [files]);

  // Get upload URLs for successful uploads
  const getUploadedUrls = useCallback(() => {
    return getUploadedFiles().map((response) => response.file);
  }, [getUploadedFiles]);

  useEffect(() => {
    return () => {
      // Clean up all object URLs when component unmounts
      files.forEach((file) => {
        if (file.imageUrl) {
          URL.revokeObjectURL(file.imageUrl);
        }
      });
    };
  }, []);

  const hasIdleFiles = files.some((f) => f.status === 'idle');
  const hasSuccessfulUploads = files.some((f) => f.status === 'success');

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          isUploading && 'pointer-events-none opacity-50',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
          multiple={multiple}
          accept={accept}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">
            {isDragging
              ? 'Drop files here'
              : `Drag & drop ${multiple ? 'files' : 'file'} here`}
          </h3>
          <p className="text-sm text-muted-foreground">
            or click to browse {multiple ? 'files' : 'file'}
          </p>
          {accept && (
            <p className="text-xs text-muted-foreground mt-1">
              Accepted types: {accept}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Max file size: {formatFileSize(maxFileSize)}
          </p>
          {multiple && (
            <p className="text-xs text-muted-foreground">
              Multiple files allowed
            </p>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center border rounded-lg p-4 bg-card"
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0 mr-4">
                  {fileItem.imageUrl ? (
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                      <img
                        src={fileItem.imageUrl}
                        alt={fileItem.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                      <FileIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {fileItem.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(fileItem.file.size)}
                  </p>
                  {fileItem.error && (
                    <p className="text-xs text-red-500 mt-1">
                      {fileItem.error}
                    </p>
                  )}

                  {/* Progress Bar */}
                  {fileItem.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={fileItem.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploading... {fileItem.progress}%
                      </p>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2 ml-4">
                  {fileItem.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}

                  {fileItem.status === 'error' && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      {!autoUpload && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => retryUpload(fileItem)}
                          disabled={isUploading}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(fileItem.id)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={clearAllFiles}
              disabled={files.length === 0 || isUploading}
            >
              Clear All
            </Button>

            {!autoUpload && hasIdleFiles && (
              <Button
                onClick={uploadAllFiles}
                disabled={isUploading || !hasIdleFiles}
              >
                {isUploading ? 'Uploading...' : 'Upload All'}
              </Button>
            )}
          </div>

          {/* Upload Summary */}
          {hasSuccessfulUploads && (
            <div className="text-sm text-muted-foreground">
              {getUploadedFiles().length} file
              {getUploadedFiles().length !== 1 ? 's' : ''} uploaded successfully
            </div>
          )}
        </div>
      )}
    </div>
  );
}
