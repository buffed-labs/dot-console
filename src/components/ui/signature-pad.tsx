'use client'
import { SignaturePad } from '@ark-ui/react/signature-pad'
import type { ComponentProps } from 'react'
import { createStyleContext } from 'styled-system/jsx'
import { signaturePad } from 'styled-system/recipes'

const { withProvider, withContext } = createStyleContext(signaturePad)

export type RootProps = ComponentProps<typeof Root>
export const Root = withProvider(SignaturePad.Root, 'root')
export const RootProvider = withProvider(SignaturePad.RootProvider, 'root')
export const Context = SignaturePad.Context
export const ClearTrigger = withContext(SignaturePad.ClearTrigger, 'clearTrigger')
export const Control = withContext(SignaturePad.Control, 'control')
export const Guide = withContext(SignaturePad.Guide, 'guide')
export const Label = withContext(SignaturePad.Label, 'label')
export const Segment = withContext(SignaturePad.Segment, 'segment')
export const HiddenInput = SignaturePad.HiddenInput

export { SignaturePadContext as SignaturePadContext } from '@ark-ui/react/signature-pad'
