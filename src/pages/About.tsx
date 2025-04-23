import React, { useState } from 'react';
import LanguageSelector from '@/components/LanguageSelector';

const aboutData = {
  name: 'About EcoCart',
  description: "EcoCart is dedicated to making sustainable shopping easy and accessible for everyone. Our mission is to connect users with eco-friendly products and responsible retailers, empowering a greener lifestyle.",
  materials: [
    'Curated eco-friendly product listings',
    'Direct links to responsible retailers',
    'Educational resources and blog',
    'Community-driven tips and reviews',
  ],
  certifications: ['Join us in our journey to make every purchase a step towards a more sustainable future!'],
};

const About: React.FC = () => {
  const [translated, setTranslated] = useState<typeof aboutData>(aboutData);

  return (
    <div className="container mx-auto py-12 px-4">
      <LanguageSelector
        name={aboutData.name}
        description={aboutData.description}
        materials={aboutData.materials}
        certifications={aboutData.certifications}
        onTranslate={({ name, description, materials, certifications }) => {
          setTranslated({
            name: name || aboutData.name,
            description: description || aboutData.description,
            materials: materials && materials.length > 0 ? materials : aboutData.materials,
            certifications: certifications && certifications.length > 0 ? certifications : aboutData.certifications,
          });
        }}
      />
      <h1 className="text-4xl font-bold mb-6">{translated.name}</h1>
      <p className="mb-4">{translated.description}</p>
      <div className="bg-green-50 rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-2">Why EcoCart?</h2>
        <ul className="list-disc ml-6 mb-2">
          {translated.materials.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <p className="text-gray-600">{translated.certifications[0]}</p>
      </div>
    </div>
  );
};

export default About;
