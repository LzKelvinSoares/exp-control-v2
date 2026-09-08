export interface ShareContent {
  title?: string
  text: string
}

export async function shareOrCopy(content: ShareContent): Promise<'shared' | 'copied'> {
  if (navigator.share) {
    await navigator.share(content)
    return 'shared'
  }

  await navigator.clipboard.writeText(content.text)
  return 'copied'
}