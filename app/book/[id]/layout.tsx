import { getAllBooks } from "@/lib/api"
import { ReactNode } from "react"

export async function generateStaticParams() {
  const response = await getAllBooks()
  const books = response.data || []

  if (books.length === 0) {
    return [{ id: "placeholder" }] // yoki hatto []
  }

  return books.map(book => ({
    id: book.id.toString(),
  }))
}


export default function BookLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}