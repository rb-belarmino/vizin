import HomePage from '@/presentation/app/page'

export default function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return <HomePage searchParams={searchParams} />
}
