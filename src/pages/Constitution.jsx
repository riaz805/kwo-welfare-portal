import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { dbService } from '../services/dbService';

export default function Constitution() {
  const [chapters, setChapters] = useState([]);
  const [clauses, setClauses] = useState([]);

  useEffect(() => {
    const loadDastoor = async () => {
      const chs = await dbService.getAll('constitutionChapters');
      const cls = await dbService.getAll('constitutionClauses');

      setChapters(chs.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setClauses(cls);
    };

    loadDastoor();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <BookOpen className="w-10 h-10 mx-auto text-emerald-600 mb-3" />
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">
          دستور العمل و آئین
        </h1>
        <p className="text-emerald-700 font-bold mt-2">
          کوزتیراج ویلفیئر آرگنائزیشن (KWO)
        </p>
      </div>

      {chapters.length === 0 ? (
        <div className="bg-white rounded-2xl border p-8 text-center text-gray-500">
          دستور ابھی درج نہیں کیا گیا۔
        </div>
      ) : (
        chapters.map((chapter) => {
          const chapterClauses = clauses.filter(
            (clause) => clause.chapterId === chapter.id
          );

          return (
            <section
              key={chapter.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4"
            >
              <h2 className="text-xl font-bold text-emerald-800 bg-emerald-50 p-3 rounded-xl">
                {chapter.title}
              </h2>

              <div className="space-y-3">
                {chapterClauses.map((clause, index) => (
                  <article
                    key={clause.id}
                    className="bg-gray-50 rounded-xl p-4"
                  >
                    <h3 className="font-bold text-gray-800 mb-2">
                      دفعہ {index + 1}
                      {clause.title ? `: ${clause.title}` : ''}
                    </h3>

                    <p className="text-gray-700 leading-8 whitespace-pre-wrap">
                      {clause.content}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
