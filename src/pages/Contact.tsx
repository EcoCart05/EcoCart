import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import LanguageSelector from '@/components/LanguageSelector';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ user_name: '', user_email: '', message: '' });
  const [status, setStatus] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus("");
    if (!formRef.current) return;

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const ownerTemplateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID; // To owner
    const userTemplateID = import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID; // To user, must be in .env
    const publicKey = import.meta.env.VITE_EMAILJS_USER_ID;

    // Debug: Log template IDs
    console.log('Owner Template ID:', ownerTemplateID);
    console.log('User Template ID:', userTemplateID);
    // Send to OWNER first
    emailjs.sendForm(serviceID, ownerTemplateID, formRef.current!, publicKey)
      .then(() => {
        // Then send to USER
        return emailjs.send(serviceID, userTemplateID, {
          user_name: form.user_name,
          user_email: form.user_email,
          message: form.message,
        }, publicKey);
      })
      .then(() => {
        setStatus("Message sent successfully!");
        setForm({ user_name: '', user_email: '', message: '' });
      })
      .catch((err) => {
        let errorMsg = "Failed to send message. Please try again later.";
        let details = '';
        if (err && err.text) {
          details = err.text;
        } else if (err && err.message) {
          details = err.message;
        } else if (typeof err === 'string') {
          details = err;
        }
        if (details.includes('Gmail_API: Invalid grant')) {
          errorMsg += ' (Your Gmail connection expired. Please reconnect your Gmail account to continue sending messages.)';
        } else if (details) {
          errorMsg += ` (Error: ${details})`;
        }
        setStatus(errorMsg);
      })
      .finally(() => setSending(false));
  };

  const contactData = {
    name: 'Contact Us',
    description: 'Have questions, feedback, or want to get in touch? Fill out the form below or email us at ecocartmanage@gmail.com.',
    materials: ['Name', 'Email', 'Message'],
    certifications: ['Send Message'],
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <LanguageSelector
        name={contactData.name}
        description={contactData.description}
        materials={contactData.materials}
        certifications={contactData.certifications}
      />
      <h1 className="text-4xl font-bold mb-6">{contactData.name}</h1>
      <p className="mb-4">
        {contactData.description.split('ecocartmanage@gmail.com').length > 1 ? (
          <>
            {contactData.description.split('ecocartmanage@gmail.com')[0]}
            <a href="mailto:ecocartmanage@gmail.com" className="text-green-700 underline">ecocartmanage@gmail.com</a>
            {contactData.description.split('ecocartmanage@gmail.com')[1]}
          </>
        ) : contactData.description}
      </p>
      <form ref={formRef} onSubmit={handleSubmit} className="bg-green-50 rounded-xl p-6 shadow-md max-w-xl mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-1">{contactData.materials[0]}</label>
          <input type="text" id="name" name="user_name" className="w-full border rounded px-3 py-2" value={form.user_name} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold mb-1">{contactData.materials[1]}</label>
          <input type="email" id="email" name="user_email" className="w-full border rounded px-3 py-2" value={form.user_email} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block font-semibold mb-1">{contactData.materials[2]}</label>
          <textarea id="message" name="message" className="w-full border rounded px-3 py-2" rows={4} value={form.message} onChange={handleChange} required></textarea>
        </div>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded" disabled={sending}>
          {sending ? "Sending..." : contactData.certifications[0]}
        </button>
        {status && <div className={`mt-4 text-sm ${status.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{status}</div>}
      </form>
    </div>
  );
};

export default Contact;
