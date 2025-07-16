"use client"

import * as React from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import Image from "next/image"

interface ClickableImageProps {
    src: string
    alt: string
    width: number
    height: number
}


export function ClickableImage({ src, alt, width, height }: ClickableImageProps) {
    return (
        <TransformWrapper >
            <TransformComponent >
                <Image src={src} alt={alt} width={width} height={height} className="rounded-lg aspect-video" />
            </TransformComponent>
        </TransformWrapper>
    )
} 