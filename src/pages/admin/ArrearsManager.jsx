import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';
import { dbService } from '../../services/dbService';
import { formatPKR } from '../../services/financialEngine';

export default function ArrearsManager() {
  const [members, setMembers] = useState([]);
  const [arrears, setArrears] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allMembers = await dbService.getAll('members');
    const allArrears = await dbService.getAll('arrears');

    setMembers(
      allMembers.filter(member => member.status !== 'Archived')
    );

    setArrears(allArrears);
  };

  const refreshData = async () => {
    setMessage('');
    await loadData();
    setMessage('بقایا جات کا ریکارڈ تازہ کر دیا گیا ہے۔');
  };

  const filteredMembers = members.filter(member => {
    const query = search.toLowerCase();

    return (
      (member.name || '').toLowerCase().includes(query) ||
      (member.memberId || '').toLowerCase().includes(query)
    );
  });

  const membersWithArrears = filteredMembers.filter(member => {
    const amount = parseInt(member.currentArrears, 10) || 0;
    return amount > 0;
  });

  const totalArrears = members.reduce(
    (sum, member) =>
      sum + (parseInt(member.currentArrears, 10) || 0),
    0
  );

  const getMemberArrearsHistory = (memberId) => {
    return arrears.filter(item => item.memberId === memberId);
  };

  return (
    <div className="space-y-6 pb-12">

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-black text-gray-900">
              بقایا جات مینجمنٹ
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              ممبران کے موجودہ بقایا جات اور بقایا ریکارڈ دیکھیں۔
            </p>
          </div>

          <button
            onClick={refreshData}
            className="px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            ریکارڈ تازہ کریں
          </button>

        </div>

      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl p-4">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">
            کل ممبران
          </p>

          <p className="text-3xl font-black text-gray-900 mt-2">
            {members.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">
            بقایا والے ممبران
          </p>

          <p className="text-3xl font-black text-rose-600 mt-2">
            {membersWithArrears.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">
            کل بقایا جات
          </p>

          <p className="text-2xl font-black text-rose-700 mt-2">
            {formatPKR(totalArrears)}
          </p>
        </div>

      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-5 border-b flex flex-col md:flex-row gap-4 justify-between">

          <div>
            <h2 className="font-bold text-gray-800">
              بقایا جات کی فہرست
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              صرف ان ممبران کو دکھایا گیا ہے جن کے ذمے بقایا رقم موجود ہے۔
            </p>
          </div>

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
                <th className="p-3">ممبر</th>
                <th className="p-3">ممبر ID</th>
                <th className="p-3">موجودہ بقایا</th>
                <th className="p-3">ریکارڈ</th>
                <th className="p-3">حالت</th>
              </tr>

            </thead>

            <tbody className="divide-y">

              {membersWithArrears.map(member => {

                const amount =
                  parseInt(member.currentArrears, 10) || 0;

                const history =
                  getMemberArrearsHistory(member.id);

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="p-3 font-bold">
                      {member.name || '-'}
                    </td>

                    <td className="p-3">
                      {member.memberId || '-'}
                    </td>

                    <td className="p-3 font-black text-rose-700">
                      {formatPKR(amount)}
                    </td>

                    <td className="p-3">
                      {history.length > 0 ? (
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-lg">
                          {history.length} ریکارڈ
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          کوئی الگ ریکارڈ نہیں
                        </span>
                      )}
                    </td>

                    <td className="p-3">

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold">
                        <AlertCircle className="w-4 h-4" />
                        بقایا موجود ہے
                      </span>

                    </td>

                  </tr>
                );

              })}

              {membersWithArrears.length === 0 && (
                <tr>

                  <td
                    colSpan="5"
                    className="p-10 text-center text-gray-500"
                  >
                    اس وقت کسی ممبر کے ذمے بقایا رقم موجود نہیں۔
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
