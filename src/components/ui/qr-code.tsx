'use client'
import { QrCode } from '@ark-ui/react/qr-code'
import type { ComponentProps } from 'react'
import { createStyleContext } from 'styled-system/jsx'
import { qrCode } from 'styled-system/recipes'

const { withProvider, withContext } = createStyleContext(qrCode)

export type RootProps = ComponentProps<typeof Root>
export const Root = withProvider(QrCode.Root, 'root')
export const RootProvider = withProvider(QrCode.RootProvider, 'root')
export const Context = QrCode.Context
export const Frame = withContext(QrCode.Frame, 'frame')
export const Overlay = withContext(QrCode.Overlay, 'overlay')
export const Pattern = withContext(QrCode.Pattern, 'pattern')
export const DownloadTrigger = QrCode.DownloadTrigger

export { QrCode as QrCodeContext } from '@ark-ui/react/qr-code'
