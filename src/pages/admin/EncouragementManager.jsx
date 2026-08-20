import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Save, Search, Award } from 'lucide-react';
import { dbService } from '../../services/dbService';

const emptyRecord = {
  memberName: '',
  title: '',
  message: '',
  date: new Date().toISOString().split('T')[0],
  amount: '',
  type: 'اعزاز',
  status: 'Active'
};

export default function EncouragementManager() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyRecord);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const data = await dbService.getAll('encouragement');

    setRecords(
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
    setForm(emptyRecord);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.memberName.trim() || !form.title.trim()) {
      setMessage('ممبر کا نام اور اعزاز/عنوان درج کرنا ضروری ہے۔');
      return;
    }

    const payload = {
      ...form,
      amount: form.amount ? parseInt(form.amount, 10) : 0
    };

    if (editingId) {
      await dbService.update('encouragement', editingId, {
        ...payload,
        updatedAt: new Date().toISOString()
      });

      setMessage('حوصلہ افزائی کا ریکارڈ کامیابی سے اپڈیٹ ہو گیا۔');
    } else {
      await dbService.add('encouragement', {
        ...payload,
        createdAt: new Date().toISOString()
      });

      setMessage('نیا حوصلہ افزائی ریکارڈ کامیابی سے شامل ہو گیا۔');
    }

    resetForm();
    await loadRecords();
  };

  const handleEdit = (record) => {
    setEditingId(record.id);

    setForm({
      memberName: record.memberName || '',
      title: record.title || '',
      message: record.message || '',
      date: record.date || '',
      amount: record.amount || '',
      type: record.type || 'اعزاز',
      status: record.status || 'Active'
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleArchive = async (record) => {
    const confirmed = window.confirm(
      `کیا آپ واقعی "${record.memberName}" کا یہ ریکارڈ آرکائیو کرنا چاہتے ہیں؟`
    );

    if (!confirmed) return;

    await dbService.update('encouragement', record.id, {
      status: 'Archived',
      archivedAt: new Date().toISOString()
    });

    setMessage('ریکارڈ آرکائیو کر دیا گیا ہے۔');
    await loadRecords();
  };

  const filteredRecords = records.filter(record => {
    const query = search.toLowerCase();

    return (
      (record.memberName || '').toLowerCase().includes(query) ||
      (record.title || '').toLowerCase().includes(query) ||
      (record.message || '').toLowerCase().includes(query) ||
      (record.type || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-900">
              حوصلہ افزائی مینجمنٹ
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              بہترین کارکردگی، زیادہ فنڈ جمع کرانے والے ممبران اور دیگر اعزازات کا ریکارڈ رکھیں۔
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

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
      >

        <h2 className="text-lg font-bold text-gray-800">
          {editingId
            ? 'حوصلہ افزائی ریکارڈ میں ترمیم'
            : 'نیا حوصلہ افزائی ریکارڈ شامل کریں'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              ممبر کا نام
            </label>

            <input
              name="memberName"
              value={form.memberName}
              onChange={handleChange}
              placeholder="ممبر کا نام"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              اعزاز / عنوان
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="مثلاً سب سے زیادہ فنڈ جمع"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              قسم
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="اعزاز">اعزاز</option>
              <option value="بہترین کارکردگی">بہترین کارکردگی</option>
              <option value="سب سے زیادہ فنڈ">سب سے زیادہ فنڈ</option>
              <option value="خصوصی تعاون">خصوصی تعاون</option>
              <option value="دیگر">دیگر</option>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-1">
              رقم (اختیاری)
            </label>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="مثلاً 5000"
              min="0"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Active">فعال / دکھائیں</option>
              <option value="Draft">مسودہ</option>
            </select>

          </div>

        </div>

        <div>

          <label className="block text-sm font-semibold text-gray-600 mb-1">
            پیغام / تفصیل
          </label>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            placeholder="ممبر کی حوصلہ افزائی کے لیے پیغام یا مکمل تفصیل..."
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 leading-7"
          />

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
                ریکارڈ محفوظ کریں
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

      {/* Records List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-5 border-b flex flex-col md:flex-row gap-4 justify-between">

          <div>
            <h2 className="font-bold text-gray-800">
              حوصلہ افزائی ریکارڈ
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              ممبران کی نمایاں کارکردگی اور اعزازات
            </p>
          </div>

          <div className="relative w-full md:w-80">

            <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ممبر یا اعزاز تلاش کریں..."
              className="w-full p-3 pr-10 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

        </div>

        <div className="divide-y">

          {filteredRecords.map(record => (

            <div
              key={record.id}
              className="p-5 hover:bg-gray-50 transition"
            >

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-2 mb-2">

                    <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">
                      {record.type || 'اعزاز'}
                    </span>

                    <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs">
                      {record.date || 'تاریخ درج نہیں'}
                    </span>

                    {record.amount > 0 && (
                      <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                        {record.amount.toLocaleString('ur-PK')} روپے
                      </span>
                    )}

                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {record.memberName}
                  </h3>

                  <p className="font-semibold text-emerald-700 mt-1">
                    {record.title}
                  </p>

                  {record.message && (
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-line leading-7">
                      {record.message}
                    </p>
                  )}

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => handleEdit(record)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                    title="ترمیم"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleArchive(record)}
                    className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                    title="آرکائیو"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>

            </div>

          ))}

          {filteredRecords.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              ابھی کوئی حوصلہ افزائی ریکارڈ موجود نہیں۔
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
