import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";

const COMMUNITY_QR = "COMMUNNITY GRP QR.jpg"; // Local asset in public/
const CHATBOT_LINK = "https://wa.me/ais/2121039148398646?s=5";

const EcoCartWhatsAppSection: React.FC = () => (
  <Card className="mb-8 shadow-lg border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
    <CardHeader className="flex flex-row items-center gap-4">
      <MessageSquare className="h-8 w-8 text-green-600" />
      <CardTitle className="text-2xl font-bold">EcoGuide WhatsApp Integration</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* QR code for WhatsApp Community */}
        <div className="flex flex-col items-center">
          <img
            src={COMMUNITY_QR}
            alt="Eco-Cart WhatsApp Community QR"
            className="w-48 h-48 rounded-lg border shadow mb-2"
            style={{ background: '#fff' }}
          />
          <div className="text-sm text-gray-700 text-center mt-2">
            <Users className="inline h-4 w-4 mr-1 text-green-500" />
            <span>Join the Eco-Cart WhatsApp Community</span>
            <br />
            <span className="text-xs text-muted-foreground">Scan with WhatsApp camera to join</span>
          </div>
        </div>
        {/* Chatbot Link */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-lg font-medium mb-4 text-center">Chat with EcoGuide AI directly on WhatsApp!</div>
          <a href={CHATBOT_LINK} target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3 flex gap-2 items-center">
              <MessageSquare className="h-5 w-5" />
              Chat with EcoGuide
            </Button>
          </a>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Click the button above to start chatting with the AI bot.<br />
            Ask about eco-friendly products, get recommendations, and more!
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default EcoCartWhatsAppSection;
