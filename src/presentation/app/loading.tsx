import { Skeleton } from '@/presentation/components/ui/skeleton'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/presentation/components/ui/card'

export default function Loading() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-7xl">
      <div className="mb-10 text-center space-y-4 flex flex-col items-center">
        <Skeleton className="h-12 w-[250px] sm:w-[400px] bg-indigo-100" />
        <Skeleton className="h-6 w-[300px] sm:w-[500px]" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="flex flex-col h-full border-border/50">
            <CardHeader className="space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardFooter className="flex gap-2 pt-4 border-t">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
