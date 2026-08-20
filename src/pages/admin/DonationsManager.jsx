import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Save, Search } from 'lucide-react';
import { dbService } from '../../services/dbService';
import { formatPKR } from '../../services/financialEngine';

const emptyDonation = {
  donorName: '',
  donorId: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  purpose: ''
};

export default function DonationsManager() {
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState(emptyDonation);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    const data = await dbService.getAll('donations');
    setDonations(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(emptyDonation);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.donorName.trim() || !form.amount) {
      setMessage('عطیہ دینے والے کا نام اور رقم درج کریں۔');
      return;
    }

    const payload = {
      ...form,
      amount: parseInt(form.amount, 10) || 0
    };

    if (editingId) {
      await dbService.update('donations', editingId, payload);
      setMessage('عطیہ کا ریکارڈ کامیابی سے اپڈیٹ ہو گیا۔');
    } else {
      await dbService.add('donations', payload);
      setMessage('نیا عطیہ کامیابی سے درج ہو گیا۔');
    }

    resetForm();
    await loadDonations();
  };

  const handleEdit = (donation) => {
    setEditingId(donation.id);

    setForm({
      donorName: donation.donorName || '',
      donorId: donation.donorId || '',
      amount: donation.amount || '',
      date: donation.date || '',
      purpose: donation.purpose || ''
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (donation) => {
    const confirmed = window.confirm(
      `کیا آپ واقعی ${donation.donorName || 'اس عطیہ'} کا ریکارڈ حذف کرنا چاہتے ہیں؟`
    );

    if (!confirmed) return;

    await dbService.update('donations', donation.id, {
      status: 'Archived',
      archivedAt: new Date().toISOString()
    });

    setMessage('عطیہ کا ریکارڈ آرکائیو کر دیا گیا ہے۔');
    await loadDonations();
  };

  const filteredDonations = donations.filter((item) => {
    const query = search.toLowerCase();

    return (
      (item.donorName || '').toLowerCase().includes(query) ||
      (item.donorId || '').toLowerCase().includes(query) ||
      (item.purpose || '').toLowerCase().includes(query)
    );
  });

  const totalDonations = filteredDonations.reduce(
    (sum, item) => sum + (parseInt(item.amount, 10) || 0),
    0
  );

  return (
    <div className="space-y-6 pb-12">

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-black text-gray-900">
          عطیات مینجمنٹ
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          تنظیم کو موصول ہونے والے تمام عطیات کا ریکارڈ منظم کریں۔
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl p-4">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
      >
        <h2 className="text-lg font-bold text-gray-800">
          {editingId ? 'عطیہ ریکارڈ میں ترمیم' : 'نیا عطیہ درج کریں'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              عطیہ دینے والے کا نام
            </label>

            <input
              name="donorName"
              value={form.donorName}
              onChange={handleChange}
              placeholder="نام"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              ممبر ID
            </label>

            <input
              name="donorId"
              value={form.donorId}
              onChange={handleChange}
              placeholder="اگر ممبر ہے تو ID"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              عطیہ کی رقم
            </label>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="مثلاً 5000"
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

        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            عطیہ کا مقصد
          </label>

          <textarea
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            rows="3"
            placeholder="مثلاً مستحق خاندان کی مدد، راشن، علاج وغیرہ"
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
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
                عطیہ محفوظ کریں
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-5 border-b flex flex-col md:flex-row gap-4 justify-between">

          <div>
            <h2 className="font-bold text-gray-800">
              عطیات کی فہرست
            </h2>

            <p className="text-sm text-emerald-700 font-bold mt-1">
              کل: {formatPKR(totalDonations)}
            </p>
          </div>

          <div className="relative w-full md:w-80">

            <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="عطیہ تلاش کریں..."
              className="w-full p-3 pr-10 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-right text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3">عطیہ دہندہ</th>
                <th className="p-3">ممبر ID</th>
                <th className="p-3">رقم</th>
                <th className="p-3">تاریخ</th>
                <th className="p-3">مقصد</th>
                <th className="p-3">کارروائی</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">

                  <td className="p-3 font-semibold">
                    {donation.donorName || '-'}
                  </td>

                  <td className="p-3">
                    {donation.donorId || '-'}
                  </td>

                  <td className="p-3 font-bold text-emerald-700">
                    {formatPKR(donation.amount)}
                  </td>

                  <td className="p-3">
                    {donation.date || '-'}
                  </td>

                  <td className="p-3 text-gray-600">
                    {donation.purpose || '-'}
                  </td>

                  <td className="p-3">

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleEdit(donation)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        title="ترمیم"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(donation)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="آرکائیو"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

              {filteredDonations.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-gray-500"
                  >
                    کوئی عطیہ ریکارڈ نہیں ملا۔
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
