
import React from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import { Link } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Brain, Leaf, MessageSquare, Sparkles, Upload, Edit } from "lucide-react";
import GreenwashingDetector from "@/components/GreenwashingDetector";
import EcoGuideChat from "@/components/EcoGuideChat";
import AIRecommendations from "@/components/AIRecommendations";
import { sampleProducts } from "@/utils/sampleData";
import WhatsAppDemo from "@/components/WhatsAppDemo";
import VisionDemo from "@/components/VisionDemo";
import EcoCartWhatsAppSection from "@/components/EcoCartWhatsAppSection";

const aiFeaturesData = {
  name: 'AI-Powered Features',
  description: 'Discover our cutting-edge AI tools designed to make sustainable shopping easier, more transparent, and accessible for everyone.',
  materials: ['All Features', 'Recommendations', 'Greenwashing Detector', 'WhatsApp'],
  certifications: [],
};

const AIFeatures = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" asChild={true} className="mr-4">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Link>
            </Button>
            <h1 className="text-3xl font-bold flex items-center">
              <Brain className="h-6 w-6 mr-2 text-green-500" />
              AI-Powered Features
            </h1>
          </div>
          <p className="text-xl max-w-3xl">
            Discover our cutting-edge AI tools designed to make sustainable shopping easier, 
            more transparent, and accessible for everyone.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="all">
          <TabsList className="mb-8 w-full justify-start">
            <TabsTrigger value="all">All Features</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="greenwashing">Greenwashing Detector</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {/* Eco Score Analyzer Card */}
            <section>
              <Card className="mb-8 shadow-xl border-green-200 bg-gradient-to-br from-green-100 to-blue-50 hover:scale-105 transition-transform cursor-pointer" onClick={() => window.location.href='/ecoscore-tool'}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Leaf className="h-8 w-8 text-green-600 animate-bounce" />
                  <CardTitle className="text-2xl font-bold">Eco Score Analyzer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-2">Upload a product image or type its ingredients to instantly get an AI-powered eco score!</p>
                  <div className="flex gap-4 mt-2">
                    <Button className="bg-green-600 hover:bg-green-700 text-white flex gap-2 items-center text-lg" onClick={e => { e.stopPropagation(); window.location.href='/ecoscore-tool'; }}>
                      <Upload /> Upload Image
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2 items-center text-lg" onClick={e => { e.stopPropagation(); window.location.href='/ecoscore-tool'; }}>
                      <Edit /> Type Ingredients
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-green-500" />
                WhatsApp Integration
              </h2>
              <EcoCartWhatsAppSection />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-green-500" />
                AI-Powered Recommendations
              </h2>
              <AIRecommendations products={sampleProducts} />
            </section>

            {/* VisionDemo OCR Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-green-500" />
                Vision AI Demo (Extract Ingredients from Image)
              </h2>
              <VisionDemo />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-green-500" />
                Greenwashing Detector
              </h2>
              <GreenwashingDetector />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
                EcoGuide AI Assistant
              </h2>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>EcoGuide AI Chat</CardTitle>
                  <CardDescription>
                    Chat with our AI assistant for personalized sustainable shopping guidance.
                    Ask questions about materials, certifications, or specific products.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <p className="mb-4">
                        EcoGuide uses advanced Natural Language Processing to understand your questions and provide
                        evidence-based answers about sustainability. The assistant can help with:
                      </p>
                      <ul className="space-y-2 list-disc list-inside mb-4">
                        <li>Comparing eco-friendliness of different materials</li>
                        <li>Explaining sustainability certifications</li>
                        <li>Finding alternatives to non-sustainable products</li>
                        <li>Providing tips for reducing your carbon footprint</li>
                      </ul>
                      <p>
                        To chat with EcoGuide, simply click the chat icon in the bottom-right corner
                        of any page.
                      </p>
                    </div>
                    <div className="md:w-1/3 flex items-center justify-center">
                      <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-full">
                        <MessageSquare className="h-20 w-20 text-green-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => {
                    const chatToggle = document.querySelector('.fixed.bottom-5.right-5.z-50 button');
                    if (chatToggle) {
                      (chatToggle as HTMLButtonElement).click();
                    }
                  }} className="w-full sm:w-auto">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Open EcoGuide Chat
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="recommendations">
            <AIRecommendations products={sampleProducts} />
          </TabsContent>

          <TabsContent value="greenwashing">
            <GreenwashingDetector />
          </TabsContent>

          <TabsContent value="whatsapp">
            <EcoCartWhatsAppSection />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            Our AI features are powered by machine learning models trained on sustainable fashion and product data.
          </p>
        </div>
      </footer>

      <EcoGuideChat />
    </div>
  );
};

export default AIFeatures;
