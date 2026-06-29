import { notFound } from "next/navigation"
import { getProductById } from "@/lib/mock"
import { ProductDetailClient } from "@/components/product-detail/product-detail-client"

type PageProps = {
  params: Promise<{ item_id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { item_id } = await params
  const product = getProductById(item_id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}