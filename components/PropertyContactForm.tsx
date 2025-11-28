'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/contexts/ContentContext';

interface Agent {
  id?: number | null;
  name: string;
  phone: string;
  email: string;
  image: string;
  position?: string;
  whatsapp?: string;
}

interface PropertyContactFormProps {
  propertyId: number;
  propertyTitle: string;
  agent: Agent;
}

export default function PropertyContactForm({ propertyId, propertyTitle, agent }: PropertyContactFormProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: t('form.defaultMessage', { title: propertyTitle }),
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`https://wordpress.7emza.ma/wp-json/api/v1/properties/${propertyId}/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: t('form.defaultMessage', { title: propertyTitle }),
        });
      } else {
        setStatus('error');
        setErrorMessage(data.message || t('form.error.failed'));
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(t('form.error.network'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24">
      <h3 className="text-lg sm:text-xl font-bold mb-4 dark:text-white">{t('property.contactAgent')}</h3>
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={agent.image || '/placeholder-agent.jpg'}
          alt={agent.name}
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
        <div>
          <div className="font-bold text-lg dark:text-white">{agent.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {agent.position || t('property.consultant')}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <a
          href={`tel:${agent.phone}`}
          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{agent.phone}</span>
        </a>
        <a
          href={`mailto:${agent.email}`}
          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{agent.email}</span>
        </a>
        {agent.whatsapp && (
          <a
            href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>{t('contact.whatsapp')}</span>
          </a>
        )}
      </div>

      {status === 'success' && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm">
          {t('form.success.agent')}
        </div>
      )}

      {status === 'error' && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder={t('form.placeholder.name')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 focus:border-transparent outline-none"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder={t('form.placeholder.email')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 focus:border-transparent outline-none"
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={t('form.placeholder.phone')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 focus:border-transparent outline-none"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          placeholder={t('form.placeholder.message')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 focus:border-transparent outline-none resize-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? t('form.button.sending') : t('form.button.send')}
        </button>
      </form>
    </div>
  );
}
