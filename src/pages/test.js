import React, { useRef } from "react";
import { Carousel } from "@/components/ui/carousel";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeInfo, ChevronRightIcon, Clock } from "lucide-react";
import Layout from "@/components/layouts/layout";

// Image Carousel Component
function ImageCarousel({ images }) {
  const carouselRef = useRef(null);

  return (
    <div className="w-full mb-8">
      <Carousel ref={carouselRef}>
        {images.map((src, index) => (
          <div key={index} className="relative w-full h-[300px] overflow-hidden rounded-sm shadow-sm">
            <img
              alt={`Image ${index}`}
              className="object-cover w-full h-full transition-transform duration-300"
              src={src}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

// Info Card Component
function InfoCard({ title, info }) {
  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <h2 className="text-lg font-semibold">{title}</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {info.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="primary">Daha Fazla Bilgi Al</Button>
      </CardFooter>
    </Card>
  );
}

// Project Details Component
function ProjectDetails({ project }) {


  return (
    <div className="w-full">
      <InfoCard
        title="Proje Bilgileri"
        info={[
          { label: "Proje Teslim Tarihi", value: project?.deliveryDate },
          { label: "Arsa Alanı", value: project?.landArea },
          { label: "Daire Tipleri", value: project?.unitTypes },
          { label: "Konut Sayısı", value: project?.unitCount },
        ]}
      />
      <InfoCard
        title="Daire Detayları"
        info={project?.unitDetails.map((detail) => ({
          label: `${detail.type} (${detail.size} m²)`,
          value: detail.price,
        }))}
      />
    </div>
  );
}

// Main Project Page Component
 function ProjectPage({ project }) {
  const images = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <ImageCarousel images={images} />
      <ProjectDetails project={project} />
    </div>
  );
}

// Example Project Data
const exampleProject = {
  deliveryDate: "2023 - 2. Çeyrek",
  landArea: "6.051 m²",
  unitTypes: "1+1, 2+1, 3+1, 4+1",
  unitCount: "152",
  unitDetails: [
    { type: "1+1", size: "61 m²", price: "₺1.000.000" },
    { type: "2+1", size: "85 m²", price: "₺1.500.000" },
    { type: "3+1", size: "110 m²", price: "₺2.000.000" },
    { type: "4+1", size: "140 m²", price: "₺2.500.000" },
  ],
};

// Usage
export default function Test() {
  return <Layout>
   <ProjectPage project={exampleProject} />
  </Layout>;
}
