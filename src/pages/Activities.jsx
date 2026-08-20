import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { dbService } from '../services/dbService';

export default function Activities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadActivities = async () => {
      const data = await dbService.getAll('activities');
      setActivities(data);
    };

    loadActivities();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <Calendar className="w-10 h-10 mx-auto text-emerald-600 mb-3" />
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">
          تنظیم کی سرگرمیاں
        </h1>
        <p className="text-gray-500 mt-2">
          کوزتیراج ویلفیئر آرگنائزیشن (KWO) کی مختلف سرگرمیاں
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
          ابھی کوئی سرگرمی درج نہیں کی گئی۔
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.map((activity) => (
            <article
              key={activity.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {activity.imageUrl && (
                <img
                  src={activity.imageUrl}
                  alt={activity.title || 'سرگرمی'}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-5 space-y-3">
                <h2 className="text-lg font-bold text-gray-900">
                  {activity.title || 'سرگرمی'}
                </h2>

                {activity.date && (
                  <p className="text-xs text-emerald-700 font-semibold">
                    {activity.date}
                  </p>
                )}

                <p className="text-sm text-gray-600 leading-7 whitespace-pre-wrap">
                  {activity.description || activity.content || ''}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
