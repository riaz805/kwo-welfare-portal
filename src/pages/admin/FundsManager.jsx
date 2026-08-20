import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/dbService';
import { processFundPayment, formatPKR } from '../../services/financialEngine';
import { useTheme } from '../../context/ThemeContext';
import { Plus, Search, CheckCircle, AlertCircle } from 'lucide-react';

export default function FundsManager() {
  const { settings } = useTheme();
  const [members, setMembers] = useState([]);
  const [funds, setFunds] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [month, setMonth] = useState(new Date().toLocaleString('ur-PK', { month: 'long' }));
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allMembers = await dbService.getAll('members');
    const allFunds = await dbService.getAll('fundTransactions');
    setMembers(allMembers.filter(m => m.status !== 'Archived'));
    setFunds(allFunds);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember || !amountPaid) return;

    const member = members.find(m => m.id === selectedMember);
    const prevArrears = member?.currentArrears || 0;

    // Execute Smart Fund + Donation Logic
    const calculation = processFundPayment({
      memberId: selectedMember,
      month,
      year,
      amountPaid: parseInt(amountPaid, 10),
      monthlyFee: settings.monthlyFee || 1000,
      previousArrears: prevArrears
    });

    // Save Fund Transaction
    await dbService.add('fundTransactions', {
      ...calculation,
      memberName: member.name,
      paymentDate: new Date().toISOString().split('T')[0]
    });

    // Save excess to Donation if present
    if (calculation.donationPortion > 0) {
      await dbService.add('donations', {
        donorId: selectedMember,
        donorName: member.name,
        amount: calculation.donationPortion,
        date: new Date().toISOString().split('T')[0],
        purpose: 'ماہانہ فنڈ اضافی رقم (خودکار عطیہ)'
      });
    }

    // Update Member Arrears Status
    await dbService.update('members', selectedMember, {
      currentArrears: calculation.netRemainingArrears
    });

    await dbService.logAudit('FUND_PAYMENT', `${member.name} کا ${amountPaid} روپے کا فنڈ درج کیا گیا۔`);

    setMessage({ type: 'success', text: 'فنڈ کی ادائیگی کامیابی سے مکمل اور درج ہو گئی ہے!' });
    setAmountPaid('');
    setSelectedMember('');
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ماہانہ فنڈ سسٹم</h1>
          <p className="text-sm text-gray-500">موجودہ مقررہ ماہانہ فنڈ: <span className="font-bold text-emerald-600">{formatPKR(settings.monthlyFee || 1000)}</span></p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800'}`}>
          <CheckCircle className="w-5 h-5" /> {message.text}
        </div>
      )}

      {/* Payment Entry Form */}
      <form onSubmit={handlePaymentSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-2">نئی فنڈ ادائیگی درج کریں</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">ممبر منتخب کریں</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">-- ممبر کا انتخاب کریں --</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.memberId || 'ID کے بغیر'})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">ادا کردہ کل رقم (روپے)</label>
            <input
              type="number"
              placeholder="مثلاً 1500"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">مہینہ</label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">سال</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-md"
        >
          فنڈ ریکارڈ محفوظ کریں
        </button>
      </form>

      {/* Recent Fund History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50/50 font-bold text-gray-800">حالیہ فنڈ وصولیاں</div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">ممبر</th>
                <th className="p-3">مہینہ / سال</th>
                <th className="p-3">کل ادا شدہ</th>
                <th className="p-3">فنڈ حصے</th>
                <th className="p-3">عطیہ حصے</th>
                <th className="p-3">بقایا جات حاصل/باقی</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {funds.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="p-3 font-semibold">{f.memberName}</td>
                  <td className="p-3">{f.month} {f.year}</td>
                  <td className="p-3 font-bold text-emerald-700">{formatPKR(f.paidAmount)}</td>
                  <td className="p-3">{formatPKR(f.fundPortion)}</td>
                  <td className="p-3 text-amber-600">{formatPKR(f.donationPortion)}</td>
                  <td className="p-3 text-rose-600">{formatPKR(f.netRemainingArrears)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
