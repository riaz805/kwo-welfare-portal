import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Save, Search, Calendar } from 'lucide-react';
import { dbService } from '../../services/dbService';

const emptyActivity = {
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  location: '',
  imageUrl: '',
  status: 'Active'
};

export default function ActivitiesManager() {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState(emptyActivity);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const data = await dbService.getAll('activities');

    setActivities(
      data.filter(item => item.status !== 'Archived')
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(emptyActivity);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setMessage('سرگرمی کا عنوان اور تفصیل درج کرنا ضروری ہے۔');
      return;
    }

    if (editingId) {
      await dbService.update('activities', editingId, {
        ...form,
        updatedAt: new Date().toISOString()
      });

      setMessage('سرگرمی کامیابی سے اپڈیٹ ہو گئی۔');
    } else {
      await dbService.add('activities', {
        ...form,
        createdAt: new Date().toISOString()
      });

      setMessage('نئی سرگرمی کامیابی سے شامل ہو گئی۔');
    }

    resetForm();
    await loadActivities();
  };

  const handleEdit = (activity) => {
    setEditingId(activity.id);

    setForm({
      title: activity.title || '',
      description: activity.description || '',
      date: activity.date || '',
      location: activity.location || '',
      imageUrl: activity.imageUrl || '',
      status: activity.status || 'Active'
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleArchive = async (activity) => {
    const confirmed = window.confirm(
      `کیا آپ واقعی "${activity.title}" کو آرکائیو کرنا چاہتے ہیں؟`
    );

    if (!confirmed) return;

    await dbService.update('activities', activity.id, {
      status: 'Archived',
      archivedAt: new Date().toISOString()
    });

    setMessage('سرگرمی آرکائیو کر دی گئی ہے۔');
    await loadActivities();
  };

  const filteredActivities = activities.filter(activity => {
    const query = search.toLowerCase();

    return (
      (activity.title || '').toLowerCase().includes(query) ||
      (activity.description || '').toLowerCase().includes(query) ||
      (activity.location || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-900">
              تنظیمی سرگرمیاں
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              تنظیم کی فلاحی، سماجی اور دیگر سرگرمیوں کا ریکارڈ رکھیں۔
            </p>
          </div>

        </div>

      </div>

      {/* Message */}
      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl p-4">
          {message}
        </div>
      )}

      {/* Add / Edit Activity */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
      >

        <h2 className="text-lg font-bold text-gray-800">
          {editingId
            ? 'سرگرمی میں ترمیم'
            : 'نئی سرگرمی شامل کریں'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              سرگرمی کا عنوان
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="مثلاً مستحق خاندانوں میں راشن تقسیم"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              تاریخ
            </label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              مقام
            </label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="مثلاً کوزتیراج"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              تصویر کا لنک
            </label>

            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="اگر تصویر کا لنک ہو تو یہاں درج کریں"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

        </div>

        <div>

          <label className="block text-sm font-semibold text-gray-600 mb-1">
            سرگرمی کی مکمل تفصیل
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="6"
            placeholder="سرگرمی کی مکمل تفصیل یہاں لکھیں..."
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 leading-7"
            required
          />

        </div>

        <div>

          <label className="block text-sm font-semibold text-gray-600 mb-1">
            حالت
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full md:w-64 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Active">فعال / شائع</option>
            <option value="Draft">مسودہ</option>
          </select>

        </div>

        {/* Image Preview */}
        {form.imageUrl && (
          <div className="border rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-2">
              تصویر کا پیش نظارہ
            </p>

            <img
              src={form.imageUrl}
              alt="Activity"
              className="max-h-64 rounded-xl object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex gap-3">

          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-2"
          >
            {editingId ? (
              <>
                <Save className="w-5 h-5" />
                تبدیلی محفوظ کریں
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                سرگرمی محفوظ کریں
              </>
            )}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
            >
              منسوخ کریں
            </button>
          )}

        </div>

      </form>

      {/* Activities List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-5 border-b flex flex-col md:flex-row gap-4 justify-between">

          <div>
            <h2 className="font-bold text-gray-800">
              موجودہ سرگرمیاں
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              تنظیم کی محفوظ شدہ سرگرمیوں کی فہرست
            </p>
          </div>

          <div className="relative w-full md:w-80">

            <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="سرگرمی تلاش کریں..."
              className="w-full p-3 pr-10 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

        </div>

        <div className="divide-y">

          {filteredActivities.map(activity => (

            <div
              key={activity.id}
              className="p-5 hover:bg-gray-50 transition"
            >

              <div className="flex flex-col lg:flex-row gap-5">

                {activity.imageUrl && (
                  <img
                    src={activity.imageUrl}
                    alt={activity.title}
                    className="w-full lg:w-40 h-28 object-cover rounded-xl"
                  />
                )}

                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-2 mb-2">

                    <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {activity.date || 'تاریخ درج نہیں'}
                    </span>

                    {activity.location && (
                      <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold">
                        {activity.location}
                      </span>
                    )}

                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {activity.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-line leading-7">
                    {activity.description}
                  </p>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => handleEdit(activity)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                    title="ترمیم"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleArchive(activity)}
                    className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                    title="آرکائیو"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>

            </div>

          ))}

          {filteredActivities.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              ابھی کوئی سرگرمی موجود نہیں۔
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
