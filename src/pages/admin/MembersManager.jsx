import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Save, Search } from 'lucide-react';
import { dbService } from '../../services/dbService';

const emptyMember = {
  name: '',
  memberId: '',
  phone: '',
  status: 'Active',
  currentArrears: 0
};

export default function MembersManager() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyMember);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const data = await dbService.getAll('members');
    setMembers(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(emptyMember);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setMessage('ممبر کا نام درج کریں۔');
      return;
    }

    if (editingId) {
      await dbService.update('members', editingId, {
        ...form,
        currentArrears: parseInt(form.currentArrears, 10) || 0
      });

      setMessage('ممبر کی معلومات کامیابی سے اپڈیٹ ہو گئیں۔');
    } else {
      await dbService.add('members', {
        ...form,
        currentArrears: parseInt(form.currentArrears, 10) || 0,
        createdAt: new Date().toISOString()
      });

      setMessage('نیا ممبر کامیابی سے شامل ہو گیا۔');
    }

    resetForm();
    await loadMembers();
  };

  const handleEdit = (member) => {
    setEditingId(member.id);

    setForm({
      name: member.name || '',
      memberId: member.memberId || '',
      phone: member.phone || '',
      status: member.status || 'Active',
      currentArrears: member.currentArrears || 0
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      `کیا آپ واقعی "${member.name}" کو حذف کرنا چاہتے ہیں؟`
    );

    if (!confirmed) return;

    await dbService.update('members', member.id, {
      status: 'Archived',
      archivedAt: new Date().toISOString()
    });

    setMessage('ممبر کو آرکائیو کر دیا گیا ہے۔');
    await loadMembers();
  };

  const filteredMembers = members.filter((member) => {
    const query = search.toLowerCase();

    return (
      (member.name || '').toLowerCase().includes(query) ||
      (member.memberId || '').toLowerCase().includes(query) ||
      (member.phone || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 pb-12">

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-black text-gray-900">
          ممبران مینجمنٹ
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          تنظیم کے ممبران کو شامل، ترمیم اور منظم کریں۔
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
          {editingId ? 'ممبر کی معلومات میں ترمیم' : 'نیا ممبر شامل کریں'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              ممبر کا نام
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="ممبر کا مکمل نام"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              ممبر ID
            </label>

            <input
              name="memberId"
              value={form.memberId}
              onChange={handleChange}
              placeholder="مثلاً KWO-001"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              موبائل نمبر
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="03XXXXXXXXX"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              موجودہ بقایا
            </label>

            <input
              type="number"
              name="currentArrears"
              value={form.currentArrears}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            ممبر کی حیثیت
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full md:w-1/2 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Active">فعال</option>
            <option value="Suspended">معطل</option>
            <option value="Archived">آرکائیو</option>
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
                ممبر شامل کریں
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

          <h2 className="font-bold text-gray-800">
            ممبران کی فہرست ({filteredMembers.length})
          </h2>

          <div className="relative w-full md:w-80">

            <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ممبر تلاش کریں..."
              className="w-full p-3 pr-10 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-right text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3">نام</th>
                <th className="p-3">ممبر ID</th>
                <th className="p-3">موبائل</th>
                <th className="p-3">حیثیت</th>
                <th className="p-3">بقایا</th>
                <th className="p-3">کارروائی</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">

                  <td className="p-3 font-semibold">
                    {member.name}
                  </td>

                  <td className="p-3">
                    {member.memberId || '-'}
                  </td>

                  <td className="p-3">
                    {member.phone || '-'}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        member.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : member.status === 'Suspended'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {member.status === 'Active'
                        ? 'فعال'
                        : member.status === 'Suspended'
                        ? 'معطل'
                        : 'آرکائیو'}
                    </span>
                  </td>

                  <td className="p-3 font-bold text-rose-600">
                    {member.currentArrears || 0} روپے
                  </td>

                  <td className="p-3">

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleEdit(member)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        title="ترمیم"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(member)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="آرکائیو"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

              {filteredMembers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-gray-500"
                  >
                    کوئی ممبر نہیں ملا۔
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
