import React, { useState } from "react";
import LanguageSelector from '@/components/LanguageSelector';
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Edit, ArrowLeft, Leaf } from "lucide-react";

async function extractIngredientsFromImage(file: File): Promise<string[]> {
  // Upload image to backend OCR API and extract text
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('http://localhost:5000/api/ocr', {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Failed to extract text from image');
  const data = await response.json();
  // Split OCR text by comma/newline and filter
  return data.text
    .split(/,|\n/)
    .map((i: string) => i.trim())
    .filter((i: string) => i.length > 0);
}

function calculateEcoScore(ingredients: string[]): { score: number; verdict: string; color: string } {
  // Example logic: penalize for palm oil, artificial flavors, high sugar, etc.
  let score = 100;
  const lower = ingredients.map((i) => i.toLowerCase());
  if (lower.includes("palm oil")) score -= 30;
  if (lower.includes("artificial flavor") || lower.includes("artificial flavours")) score -= 20;
  if (lower.includes("sugar") || lower.includes("glucose")) score -= 10;
  if (lower.includes("emulsifier")) score -= 10;
  if (lower.includes("preservative")) score -= 15;
  if (lower.includes("colorant") || lower.includes("colour")) score -= 10;
  if (lower.includes("organic")) score += 10;
  if (score > 90) return { score, verdict: "Excellent", color: "#22c55e" };
  if (score > 70) return { score, verdict: "Good", color: "#84cc16" };
  if (score > 50) return { score, verdict: "Moderate", color: "#fbbf24" };
  return { score, verdict: "Poor", color: "#ef4444" };
}

function calculateEcoScoreWithPercent(ingredients: Record<string, number>): { score: number; verdict: string; color: string } {
  // Weighted score: penalize by percentage
  let score = 100;
  const lower = Object.entries(ingredients).map(([name, percent]) => [name.toLowerCase(), percent] as [string, number]);
  lower.forEach(([name, percent]) => {
    if (name.includes("palm oil")) score -= 30 * (percent / 100);
    if (name.includes("artificial flavor") || name.includes("artificial flavours")) score -= 20 * (percent / 100);
    if (name.includes("sugar") || name.includes("glucose")) score -= 10 * (percent / 100);
    if (name.includes("emulsifier")) score -= 10 * (percent / 100);
    if (name.includes("preservative")) score -= 15 * (percent / 100);
    if (name.includes("colorant") || name.includes("colour")) score -= 10 * (percent / 100);
    if (name.includes("organic")) score += 10 * (percent / 100);
  });
  score = Math.max(0, Math.min(100, score));
  if (score > 90) return { score, verdict: "Excellent", color: "#22c55e" };
  if (score > 70) return { score, verdict: "Good", color: "#84cc16" };
  if (score > 50) return { score, verdict: "Moderate", color: "#fbbf24" };
  return { score, verdict: "Poor", color: "#ef4444" };
}


const ecoScoreData = {
  name: 'Eco Score Analyzer',
  description: 'Upload a product image or type its ingredients to instantly get an AI-powered eco score!',
  materials: ['Upload Image', 'Analyze Ingredients'],
  certifications: ['Excellent', 'Good', 'Moderate', 'Poor'],
};

const EcoScoreTool: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"choose" | "upload" | "type" | "result">("choose");
  const [ingredients, setIngredients] = useState<string[]>([]);
  // For new structured input
  const [ingredientCount, setIngredientCount] = useState<number>(0);
  const [ingredientInputs, setIngredientInputs] = useState<{ name: string; percent: number }[]>([]);
  const [typed, setTyped] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [ecoResult, setEcoResult] = useState<{ score: number; verdict: string; color: string } | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageLoading(true);
      try {
        const extracted = await extractIngredientsFromImage(e.target.files[0]);
        setIngredients(extracted);
        const result = calculateEcoScore(extracted);
        setEcoResult(result);
        setStep("result");
      } catch (err) {
        alert("Failed to extract ingredients from image. Please try a clearer image.");
      } finally {
        setImageLoading(false);
      }
    }
  };

  // For new structured input
  const handleIngredientCountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredientCount < 1) return setInputError("Enter a valid number of ingredients.");
    setIngredientInputs(Array.from({ length: ingredientCount }, () => ({ name: "", percent: 0 })));
    setInputError(null);
  };

  const handleIngredientInputChange = (idx: number, field: "name" | "percent", value: string | number) => {
    setIngredientInputs(inputs => {
      const newInputs = [...inputs];
      newInputs[idx] = {
        ...newInputs[idx],
        [field]: field === "percent" ? Number(value) : value
      };
      return newInputs;
    });
  };

  const handleStructuredSubmit = () => {
    // Validate
    const total = ingredientInputs.reduce((sum, ing) => sum + (Number(ing.percent) || 0), 0);
    if (ingredientInputs.some(ing => !ing.name.trim())) {
      setInputError("All ingredient names are required.");
      return;
    }
    if (total !== 100) {
      setInputError("Total percentage must be exactly 100%.");
      return;
    }
    setInputError(null);
    // Convert to dict/object
    const dict: Record<string, number> = {};
    ingredientInputs.forEach(ing => { dict[ing.name.trim()] = Number(ing.percent); });
    setIngredients(Object.keys(dict)); // For display
    const result = calculateEcoScoreWithPercent(dict);
    setEcoResult(result);
    setStep("result");
  };

  // For compatibility, leave old textarea handler for now
  const handleTypedSubmit = () => {
    const ingList = typed.split(/,|\n/).map(i => i.trim()).filter(i => i);
    setIngredients(ingList);
    const result = calculateEcoScore(ingList);
    setEcoResult(result);
    setStep("result");
  };


  // Reset ecoResult when returning to choose/upload/type
  React.useEffect(() => {
    if (step !== "result" && ecoResult) setEcoResult(null);
    // eslint-disable-next-line
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center px-4 py-12">
      <Button variant="ghost" className="absolute left-4 top-4 flex items-center" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-5 w-5" /> Back
      </Button>
      <Card className="w-full max-w-xl shadow-2xl animate-fade-in border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Leaf className="text-green-600" /> Eco Score Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === "choose" && (
            <div className="flex flex-col gap-6 items-center">
              <p className="text-lg text-center">How would you like to check your product's eco score?</p>
              <Button className="w-full max-w-xs flex gap-2 items-center justify-center text-lg bg-green-600 hover:bg-green-700" onClick={() => setStep("upload")}> <Upload /> Upload Product Image </Button>
              <Button className="w-full max-w-xs flex gap-2 items-center justify-center text-lg bg-blue-600 hover:bg-blue-700" onClick={() => setStep("type")}> <Edit /> Type Ingredients </Button>
            </div>
          )}
          {step === "upload" && (
            <div className="flex flex-col gap-6 items-center">
              <label className="w-full max-w-xs flex flex-col items-center gap-2 p-6 border-2 border-dashed border-green-400 rounded-lg cursor-pointer hover:bg-green-50 transition">
                <Upload className="h-8 w-8 text-green-600" />
                <span className="text-center text-green-900">Upload a clear image of the product's ingredient list</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              {imageLoading && <span className="text-green-700">Extracting ingredients...</span>}
            </div>
          )}
          {step === "type" && (
            <div className="flex flex-col gap-6 items-center">
              {/* Step 1: Ask for number of ingredients */}
              {ingredientInputs.length === 0 && (
                <form onSubmit={handleIngredientCountSubmit} className="flex flex-col gap-3 items-center w-full">
                  <label className="text-lg">How many ingredients are in the product?</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full max-w-xs rounded border border-green-300 p-3 text-lg focus:outline-green-600"
                    value={ingredientCount === 0 ? "" : ingredientCount}
                    onChange={e => setIngredientCount(Number(e.target.value))}
                    required
                  />
                  <Button type="submit" className="w-full max-w-xs bg-green-600 hover:bg-green-700">Next</Button>
                  {inputError && <span className="text-red-600 text-sm mt-2">{inputError}</span>}
                </form>
              )}
              {/* Step 2: Render ingredient fields */}
              {ingredientInputs.length > 0 && (
                <div className="flex flex-col gap-3 w-full">
                  <label className="text-lg">Enter ingredient names and their percentage (total must be 100%)</label>
                  {ingredientInputs.map((ing, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder={`Ingredient #${idx + 1}`}
                        className="rounded border border-green-300 p-2 flex-1"
                        value={ing.name}
                        onChange={e => handleIngredientInputChange(idx, "name", e.target.value)}
                        required
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="%"
                        className="rounded border border-green-300 p-2 w-20"
                        value={ing.percent}
                        onChange={e => handleIngredientInputChange(idx, "percent", e.target.value)}
                        required
                      />
                      <span className="text-green-700">%</span>
                    </div>
                  ))}
                  <Button className="w-full max-w-xs bg-green-600 hover:bg-green-700 mt-2" onClick={handleStructuredSubmit}>Analyze Eco Score</Button>
                  <Button variant="ghost" className="w-full max-w-xs mt-0" onClick={() => { setIngredientInputs([]); setIngredientCount(0); }}>Back</Button>
                  {inputError && <span className="text-red-600 text-sm mt-2">{inputError}</span>}
                </div>
              )}
            </div>
          )}
          {step === "result" && ecoResult && (
            <div className="flex flex-col gap-4 items-center">
              <h3 className="text-xl font-semibold">Eco Score Result</h3>
              <div className="flex flex-col items-center gap-2">
                <span className="text-6xl font-bold" style={{ color: ecoResult.color }}>{ecoResult.score}</span>
                <span className="text-lg font-semibold" style={{ color: ecoResult.color }}>{ecoResult.verdict}</span>
              </div>
              <div className="w-full max-w-xs text-left mt-4">
                <span className="font-bold">Ingredients:</span>
                <ul className="list-disc ml-5 mt-1 text-green-900">
                  {ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>
              </div>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => setStep("choose")}>Analyze Another Product</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EcoScoreTool;
