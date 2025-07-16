"use client"

import * as React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import Image from "next/image"

interface ImageModalProps {
    isOpen: boolean
    onClose: () => void
    src: string
    alt: string
    title?: string
}

export function ImageModal({ isOpen, onClose, src, alt, title }: ImageModalProps) {
    const [scale, setScale] = React.useState(1)
    const [rotation, setRotation] = React.useState(0)
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = React.useState(false)
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev * 1.2, 3))
    }

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev / 1.2, 0.5))
    }

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360)
    }

    const handleReset = () => {
        setScale(1)
        setRotation(0)
        setPosition({ x: 0, y: 0 })
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true)
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            })
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleClose = () => {
        handleReset()
        onClose()
    }

    React.useEffect(() => {
        if (!isOpen) {
            handleReset()
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/90 border-0">
                <div className="relative w-full h-full flex flex-col">
                    {/* Header with controls */}
                    <div className="flex items-center justify-between p-4 bg-black/50 text-white">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleZoomIn}
                                className="text-white hover:bg-white/20"
                                disabled={scale >= 3}
                            >
                                <ZoomIn className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleZoomOut}
                                className="text-white hover:bg-white/20"
                                disabled={scale <= 0.5}
                            >
                                <ZoomOut className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRotate}
                                className="text-white hover:bg-white/20"
                            >
                                <RotateCw className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleReset}
                                className="text-white hover:bg-white/20"
                            >
                                Reset
                            </Button>
                        </div>

                        <div className="flex items-center space-x-4">
                            {title && (
                                <span className="text-sm font-medium">{title}</span>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClose}
                                className="text-white hover:bg-white/20"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Image container */}
                    <div
                        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px)`,
                                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                            }}
                        >
                            <div
                                style={{
                                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                                    transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                                }}
                                className="relative"
                            >
                                <Image
                                    src={src}
                                    alt={alt}
                                    width={800}
                                    height={600}
                                    className="max-w-none object-contain"
                                    style={{
                                        maxWidth: '80vw',
                                        maxHeight: '70vh'
                                    }}
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer with scale info */}
                    <div className="p-2 bg-black/50 text-white text-center text-sm">
                        <span>Scale: {Math.round(scale * 100)}% | Rotation: {rotation}°</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 