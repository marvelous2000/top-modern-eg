"use client"

import { motion } from "framer-motion"
import { StoneCard } from "@/components/ui/stone-card"
import { itemVariants } from "@/components/ui/stagger-container"

interface ProductItem {
  image: string
  title: string
  description: string
  href: string
}

interface FeaturedProductsClientProps {
  products: ProductItem[]
}

export default function FeaturedProductsClient({ products }: FeaturedProductsClientProps) {
  return (
    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <motion.div key={index} variants={itemVariants} transition={{ ease: [0.4, 0, 0.2, 1] }}>
          <StoneCard {...product} />
        </motion.div>
      ))}
    </div>
  )
}
