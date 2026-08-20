import React, { useEffect, useState } from 'react';
import { Award, Heart } from 'lucide-react';
import { dbService } from '../services/dbService';

export default function Encouragement() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await dbService.getAll('encouragement');
      setItems(data);
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <Award className="w-10 h-10 mx-auto text-amber-500 mb-3" />

        <h1 className="text-2xl md:text-3xl font-black text-gray-900">
          حوصلہ افزائی
        </h1>

        <p className="text-gray-500 mt-2">
          تنظیم کے نمایاں اور قابلِ تحسین ممبران
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
          ابھی حوصلہ افزائی کے لیے کوئی ریکارڈ موجود نہیں۔
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-4"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name || item.title || 'ممبر'}
                  className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-amber-100"
                />
              ) : (
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Heart className="w-9 h-9" />
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {item.name || item.title || 'معزز رکن'}
                </h2>

                {item.date && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    {item.date}
                  </p>
                )}
              </div>

              <p className="text-sm text-gray-600 leading-7 whitespace-pre-wrap">
                {item.description || item.content || ''}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
