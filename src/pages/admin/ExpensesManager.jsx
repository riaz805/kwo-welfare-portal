import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Save, Search } from 'lucide-react';
import { dbService } from '../../services/dbService';
import { formatPKR } from '../../services/financialEngine';

const emptyExpense = {
  title: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  category: '',
  description: ''
};

export default function ExpensesManager() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(emptyExpense);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const data = await dbService.getAll('expenses');
    setExpenses(data.filter(item => item.status !== 'Archived'));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(emptyExpense);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.amount) {
      setMessage('اخراجے کی تفصیل اور رقم درج کرنا ضروری ہے۔');
      return;
    }

    const payload = {
      ...form,
      amount: parseInt(form.amount, 10) || 0
    };

    if (editingId) {
      await dbService.update('expenses', editingId, payload);
      setMessage('اخراجے کا ریکارڈ کامیابی سے اپڈیٹ ہو گیا۔');
    } else {
      await dbService.add('expenses', payload);
      setMessage('نیا اخراجہ کامیابی سے درج ہو گیا۔');
    }

    resetForm();
    await loadExpenses();
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);

    setForm({
      title: expense.title || '',
      amount: expense.amount || '',
      date: expense.date || '',
      category: expense.category || '',
      description: expense.description || ''
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (expense) => {
    const confirmed = window.confirm(
      `کیا آپ واقعی "${expense.title}" کا ریکارڈ آرکائیو کرنا چاہتے ہیں؟`
    );

    if (!confirmed) return;

    await dbService.update('expenses', expense.id, {
      status: 'Archived',
      archivedAt: new Date().toISOString()
    });

    setMessage('اخراجے کا ریکارڈ آرکائیو کر دیا گیا ہے۔');
    await loadExpenses();
  };

  const filteredExpenses = expenses.filter(item => {
    const query = search.toLowerCase();

    return (
      (item.title || '').toLowerCase().includes(query) ||
      (item.category || '').toLowerCase().includes(query) ||
      (item.description || '').toLowerCase().includes(query)
    );
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum, item) => sum + (parseInt(item.amount, 10) || 0),
    0
  );

  return (
    <div className="space-y-6 pb-12">

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-black text-gray-900">
          اخراجات مینجمنٹ
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          تنظیم کے تمام اخراجات کا ریکارڈ درج، ترمیم اور منظم کریں۔
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
          {editingId ? 'اخراجے کے ریکارڈ میں ترمیم' : 'نیا اخراجہ درج کریں'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              اخراجے کی تفصیل
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="مثلاً راشن، علاج، سفر"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              رقم
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

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              قسم
            </label>

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="مثلاً راشن، علاج، انتظامی"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            اضافی تفصیل
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="اخراجے کے بارے میں مزید معلومات..."
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
                اخراجہ محفوظ کریں
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
              اخراجات کی فہرست
            </h2>

            <p className="text-sm text-rose-700 font-bold mt-1">
              کل اخراجات: {formatPKR(totalExpenses)}
            </p>
          </div>

          <div className="relative w-full md:w-80">

            <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="اخراجہ تلاش کریں..."
              className="w-full p-3 pr-10 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-right text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3">تفصیل</th>
                <th className="p-3">قسم</th>
                <th className="p-3">رقم</th>
                <th className="p-3">تاریخ</th>
                <th className="p-3">اضافی تفصیل</th>
                <th className="p-3">کارروائی</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {filteredExpenses.map(expense => (
                <tr
                  key={expense.id}
                  className="hover:bg-gray-50"
                >

                  <td className="p-3 font-semibold">
                    {expense.title || '-'}
                  </td>

                  <td className="p-3">
                    {expense.category || '-'}
                  </td>

                  <td className="p-3 font-bold text-rose-700">
                    {formatPKR(expense.amount)}
                  </td>

                  <td className="p-3">
                    {expense.date || '-'}
                  </td>

                  <td className="p-3 text-gray-600">
                    {expense.description || '-'}
                  </td>

                  <td className="p-3">

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        title="ترمیم"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(expense)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="آرکائیو"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-gray-500"
                  >
                    کوئی اخراجہ ریکارڈ نہیں ملا۔
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
