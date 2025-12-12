import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import Image from "next/image";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Mock product data
  const product = {
    name: "Calacatta Gold Marble",
    slug: "calacatta-gold-marble",
    description: "A luxurious and timeless choice, Calacatta Gold marble features a creamy white background with dramatic, thick veins in gray and gold. Its bold patterning makes it a focal point in any application, from kitchen countertops to statement walls.",
    category: "Marble",
    price: 150.00,
    rating: 4.8,
    reviews: 72,
    images: [
      "/carrara-marble-kitchen-countertop-with-gold-fixtur.jpg",
      "/luxurious-calacatta-gold-marble-with-golden-veinin.jpg",
      "/calacatta-gold-marble-bold-veining-luxury.jpg",
    ],
    features: [
      "Distinctive gold and gray veining",
      "Sourced from the Apuan Alps in Italy",
      "Polished finish for a high-gloss look",
      "Ideal for high-impact applications"
    ]
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((src, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="relative aspect-square">
                      <Image
                        src={src}
                        alt={`${product.name} - view ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium text-primary mb-2">{product.category.toUpperCase()}</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            {product.description}
          </p>
          <Separator className="my-6" />
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Key Features</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-4xl font-bold font-serif">${product.price.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">/ sq. ft.</span>
          </div>
          <Button size="lg" className="mt-8 w-full sm:w-auto">
            Request a Quote
          </Button>
        </div>
      </div>
    </div>
  );
}