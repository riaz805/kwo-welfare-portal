import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Save, Search, Bell } from 'lucide-react';
import { dbService } from '../../services/dbService';

const emptyNotice = {
  title: '',
  type: 'عام نوٹس',
  content: '',
  status: 'Active',
  date: new Date().toISOString().split('T')[0]
};

export default function NoticesManager() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState(emptyNotice);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    const data = await dbService.getAll('notices');
    setNotices(
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
    setForm(emptyNotice);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      setMessage('نوٹس کا عنوان اور مکمل متن درج کرنا ضروری ہے۔');
      return;
    }

    if (editingId) {
      await dbService.update('notices', editingId, {
        ...form,
        updatedAt: new Date().toISOString()
      });

      setMessage('نوٹس کامیابی سے اپڈیٹ ہو گیا۔');
    } else {
      await dbService.add('notices', {
        ...form,
        createdAt: new Date().toISOString()
      });

      setMessage('نیا نوٹس کامیابی سے شائع ہو گیا۔');
    }

    resetForm();
    await loadNotices();
  };

  const handleEdit = (notice) => {
    setEditingId(notice.id);

    setForm({
      title: notice.title || '',
      type: notice.type || 'عام نوٹس',
      content: notice.content || '',
      status: notice.status || 'Active',
      date: notice.date || ''
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleArchive = async (notice) => {
    const confirmed = window.confirm(
      `کیا آپ واقعی "${notice.title}" کو آرکائیو کرنا چاہتے ہیں؟`
    );

    if (!confirmed) return;

    await dbService.update('notices', notice.id, {
      status: 'Archived',
      archivedAt: new Date().toISOString()
    });

    setMessage('نوٹس آرکائیو کر دیا گیا ہے۔');
    await loadNotices();
  };

  const filteredNotices = notices.filter(notice => {
    const query = search.toLowerCase();

    return (
      (notice.title || '').toLowerCase().includes(query) ||
      (notice.content || '').toLowerCase().includes(query) ||
      (notice.type || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-900">
              نوٹس بورڈ مینجمنٹ
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              تنظیم کے اعلانات، انتباہات اور اہم نوٹسز کا انتظام کریں۔
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

      {/* Add / Edit Notice */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
      >

        <h2 className="text-lg font-bold text-gray-800">
          {editingId ? 'نوٹس میں ترمیم' : 'نیا نوٹس شامل کریں'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="lg:col-span-2">

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              نوٹس کا عنوان
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="مثلاً ماہانہ فنڈ جمع کرانے کا اہم نوٹس"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              نوٹس کی قسم
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option>عام نوٹس</option>
              <option>اہم اعلان</option>
              <option>انتباہ</option>
              <option>معطلی کا نوٹس</option>
              <option>انتظامی حکم</option>
              <option>فنڈ نوٹس</option>
            </select>

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

        </div>

        <div>

          <label className="block text-sm font-semibold text-gray-600 mb-1">
            نوٹس کی مکمل تفصیل
          </label>

          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="7"
            placeholder="یہاں نوٹس کا مکمل متن لکھیں..."
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
                نوٹس شائع کریں
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

      {/* Notices List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-5 border-b flex flex-col md:flex-row gap-4 justify-between">

          <div>
            <h2 className="font-bold text-gray-800">
              موجودہ نوٹسز
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              فعال اور مسودہ نوٹسز کی فہرست
            </p>
          </div>

          <div className="relative w-full md:w-80">

            <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="نوٹس تلاش کریں..."
              className="w-full p-3 pr-10 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

        </div>

        <div className="divide-y">

          {filteredNotices.map(notice => (

            <div
              key={notice.id}
              className="p-5 hover:bg-gray-50 transition"
            >

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-2 mb-2">

                    <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">
                      {notice.type || 'عام نوٹس'}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        notice.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {notice.status === 'Active'
                        ? 'فعال'
                        : 'مسودہ'}
                    </span>

                    <span className="text-xs text-gray-400">
                      {notice.date || ''}
                    </span>

                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {notice.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-line leading-7">
                    {notice.content}
                  </p>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => handleEdit(notice)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                    title="ترمیم"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleArchive(notice)}
                    className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                    title="آرکائیو"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>

            </div>

          ))}

          {filteredNotices.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              ابھی کوئی نوٹس موجود نہیں۔
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
