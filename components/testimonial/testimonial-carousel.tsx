'use client';

import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { Card, CardContent } from '../ui/card';

const TestimonialCarousel = () => {
  const testimonials = [
    {
      text: 'This journal has become an essential part of my daily routine. The mood tracking feature is incredibly insightful.',
      author: 'Sarah K.',
      role: 'Daily Writer',
    },
    {
      text: "The daily prompts have helped me overcome writer's block countless times. Absolutely love this platform!",
      author: 'Michael R.',
      role: 'Creative Writer',
    },
    {
      text: 'Clean, intuitive, and secure. Everything I need in a digital journal. The export feature is a game-changer.',
      author: 'Emily T.',
      role: 'Professional Blogger',
    },
    {
      text: "The mood analytics have helped me understand my emotional patterns. It's like having a therapist in my pocket.",
      author: 'David L.',
      role: 'Mental Health Advocate',
    },
    {
      text: "I've tried many journaling apps, but this one's attention to privacy and security sets it apart.",
      author: 'Rachel M.',
      role: 'Privacy Conscious Writer',
    },
  ];
  return (
    <div className="mt-24">
      <h2 className="text-3xl font-bold text-center text-orange-900 mb-12">
        What Our Writers Say
      </h2>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full mx-auto"
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <blockquote className="space-y-4">
                    <p className="text-orange-700 italic">
                      &quot;{testimonial.text}&quot;
                    </p>
                    <footer>
                      <div className="font-semibold text-orange-900">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-orange-600">
                        {testimonial.role}
                      </div>
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default TestimonialCarousel;
