'use client'
import { TreeView } from '@ark-ui/react/tree-view'
import { ChevronRightIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { createStyleContext } from 'styled-system/jsx'
import { treeView } from 'styled-system/recipes'

const { withProvider, withContext } = createStyleContext(treeView)

export type RootProps = ComponentProps<typeof Root>
export const Root = withProvider(TreeView.Root, 'root')
export const RootProvider = withProvider(TreeView.RootProvider, 'root')
export const Branch = withContext(TreeView.Branch, 'branch')
export const BranchContent = withContext(TreeView.BranchContent, 'branchContent')
export const BranchControl = withContext(TreeView.BranchControl, 'branchControl')
export const BranchIndentGuide = withContext(TreeView.BranchIndentGuide, 'branchIndentGuide')
export const BranchIndicator = withContext(TreeView.BranchIndicator, 'branchIndicator', {
  defaultProps: { children: <ChevronRightIcon /> },
})
export const BranchText = withContext(TreeView.BranchText, 'branchText')
export const BranchTrigger = withContext(TreeView.BranchTrigger, 'branchTrigger')
export const Item = withContext(TreeView.Item, 'item')
export const ItemIndicator = withContext(TreeView.ItemIndicator, 'itemIndicator')
export const ItemText = withContext(TreeView.ItemText, 'itemText')
export const Label = withContext(TreeView.Label, 'label')
export const Tree = withContext(TreeView.Tree, 'tree')
export const NodeProvider = TreeView.NodeProvider

export type NodeProviderProps = ComponentProps<typeof NodeProvider>

export { TreeViewContext as Context } from '@ark-ui/react/tree-view'
