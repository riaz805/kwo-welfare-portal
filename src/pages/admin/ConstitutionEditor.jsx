import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/dbService';
import { Plus, Trash2, Edit3, Save, Download, FileText } from 'lucide-react';

export default function ConstitutionEditor() {
  const [chapters, setChapters] = useState([]);
  const [clauses, setClauses] = useState([]);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [newClauseTitle, setNewClauseTitle] = useState('');
  const [newClauseContent, setNewClauseContent] = useState('');

  useEffect(() => {
    loadDastoor();
  }, []);

  const loadDastoor = async () => {
    const chs = await dbService.getAll('constitutionChapters');
    const cls = await dbService.getAll('constitutionClauses');
    setChapters(chs);
    setClauses(cls);
  };

  const handleAddChapter = async () => {
    if (!newChapterTitle) return;
    await dbService.add('constitutionChapters', {
      title: newChapterTitle,
      order: chapters.length + 1
    });
    setNewChapterTitle('');
    loadDastoor();
  };

  const handleAddClause = async () => {
    if (!selectedChapter || !newClauseContent) return;
    await dbService.add('constitutionClauses', {
      chapterId: selectedChapter,
      title: newClauseTitle,
      content: newClauseContent,
      createdAt: new Date().toISOString()
    });
    setNewClauseTitle('');
    setNewClauseContent('');
    loadDastoor();
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">دستور و قوانین مینجمنٹ</h1>
          <p className="text-sm text-gray-500">تنظیم کا مکمل آئین، ابواب اور دفعات ایڈٹ کریں</p>
        </div>
        <button
          onClick={handlePrintPDF}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition"
        >
          <Download className="w-4 h-4" /> دستور PDF پرنٹ کریں
        </button>
      </div>

      {/* Add Chapter Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-800">نیا باب (Chapter) شامل کریں</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="مثلاً: باب اول - ممبرشپ کے قوانین"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleAddChapter}
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> باب محفوظ کریں
          </button>
        </div>
      </div>

      {/* Add Clause Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-800">نئی دفعہ (Clause) شامل کریں</h2>
        <div className="space-y-3">
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">-- متعلقہ باب کا انتخاب کریں --</option>
            {chapters.map(ch => (
              <option key={ch.id} value={ch.id}>{ch.title}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="دفعہ کا عنوان (آپشنل)"
            value={newClauseTitle}
            onChange={(e) => setNewClauseTitle(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <textarea
            rows="4"
            placeholder="دفعہ کی مکمل تفصیلی تحریر..."
            value={newClauseContent}
            onChange={(e) => setNewClauseContent(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>

          <button
            onClick={handleAddClause}
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition"
          >
            دفعہ شامل کریں
          </button>
        </div>
      </div>

      {/* Interactive Display & Printable Dastoor */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8 print:shadow-none print:border-none">
        <div className="text-center space-y-2 border-b pb-6">
          <h1 className="text-3xl font-black text-gray-900">دستور العمل و آئین</h1>
          <p className="text-emerald-700 font-bold">کوزتیراج ویلفیئر آرگنائزیشن (KWO)</p>
        </div>

        {chapters.map((ch) => {
          const chapterClauses = clauses.filter(cl => cl.chapterId === ch.id);
          return (
            <div key={ch.id} className="space-y-4">
              <h2 className="text-xl font-bold text-emerald-800 bg-emerald-50/80 p-3 rounded-xl border-r-4 border-emerald-600">
                {ch.title}
              </h2>
              <div className="space-y-3 pr-4">
                {chapterClauses.map((clause, idx) => (
                  <div key={clause.id} className="p-4 bg-gray-50 rounded-xl space-y-1">
                    <h3 className="font-bold text-gray-800">
                      دفعہ {idx + 1}: {clause.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">{clause.content}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
