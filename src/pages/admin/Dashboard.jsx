import React, { useEffect, useState } from 'react';
import {
  Users,
  Wallet,
  HeartHandshake,
  Receipt,
  Clock,
  Bell
} from 'lucide-react';
import { dbService } from '../../services/dbService';
import { formatPKR } from '../../services/financialEngine';

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [funds, setFunds] = useState([]);
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [arrears, setArrears] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const [
      membersData,
      fundsData,
      donationsData,
      expensesData,
      arrearsData,
      noticesData
    ] = await Promise.all([
      dbService.getAll('members'),
      dbService.getAll('fundTransactions'),
      dbService.getAll('donations'),
      dbService.getAll('expenses'),
      dbService.getAll('arrears'),
      dbService.getAll('notices')
    ]);

    setMembers(membersData);
    setFunds(fundsData);
    setDonations(donationsData);
    setExpenses(expensesData);
    setArrears(arrearsData);
    setNotices(noticesData);
  };

  const totalFunds = funds.reduce(
    (sum, item) => sum + (parseInt(item.fundPortion, 10) || 0),
    0
  );

  const totalDonations = donations.reduce(
    (sum, item) => sum + (parseInt(item.amount, 10) || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + (parseInt(item.amount, 10) || 0),
    0
  );

  const totalArrears = members.reduce(
    (sum, member) => sum + (parseInt(member.currentArrears, 10) || 0),
    0
  );

  const cards = [
    {
      title: 'کل ممبران',
      value: members.length,
      icon: Users,
      bg: 'bg-blue-50',
      text: 'text-blue-600'
    },
    {
      title: 'کل فنڈز',
      value: formatPKR(totalFunds),
      icon: Wallet,
      bg: 'bg-emerald-50',
      text: 'text-emerald-600'
    },
    {
      title: 'کل عطیات',
      value: formatPKR(totalDonations),
      icon: HeartHandshake,
      bg: 'bg-amber-50',
      text: 'text-amber-600'
    },
    {
      title: 'کل اخراجات',
      value: formatPKR(totalExpenses),
      icon: Receipt,
      bg: 'bg-rose-50',
      text: 'text-rose-600'
    },
    {
      title: 'کل بقایاجات',
      value: formatPKR(totalArrears),
      icon: Clock,
      bg: 'bg-orange-50',
      text: 'text-orange-600'
    },
    {
      title: 'کل نوٹسز',
      value: notices.length,
      icon: Bell,
      bg: 'bg-purple-50',
      text: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6 pb-12">

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-black text-gray-900">
          ایڈمن ڈیش بورڈ
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          کوزتیراج ویلفیئر آرگنائزیشن (KWO) کا انتظامی خلاصہ
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">
                    {card.title}
                  </p>

                  <p className="text-2xl font-black text-gray-900 mt-2">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`w-12 h-12 rounded-xl ${card.bg} ${card.text} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          سسٹم کی موجودہ صورتحال
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500">فنڈ ریکارڈز</p>
            <p className="text-xl font-black text-gray-800 mt-1">
              {funds.length}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500">عطیات ریکارڈز</p>
            <p className="text-xl font-black text-gray-800 mt-1">
              {donations.length}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500">اخراجات ریکارڈز</p>
            <p className="text-xl font-black text-gray-800 mt-1">
              {expenses.length}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500">بقایا ریکارڈز</p>
            <p className="text-xl font-black text-gray-800 mt-1">
              {arrears.length}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
