//Renders the structured syllabus of lessons inside a course, showing each lesson's number, duration, completion status (✓ Completed vs Unread), and one-tap launch into LessonReader.jsx.

import React from 'react';

export default function LessonList({
  lessons = [],
  completedLessonNumbers = [],
  onSelectLesson,
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-0.5">
        <h4 className="font-serif text-[16px] font-semibold text-primary">
          Course Syllabus ({lessons.length} Lessons)
        </h4>
        <span className="text-[11px] font-bold text-[#135332]">
          {completedLessonNumbers.length}/{lessons.length} Done
        </span>
      </div>

      {lessons.map((lesson) => {
        const isDone = completedLessonNumbers.includes(lesson.number);

        return (
          <button
            key={lesson.number}
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(10);
              } catch (_) {}
              if (onSelectLesson) onSelectLesson(lesson);
            }}
            className={`w-full text-left rounded-[18px] p-3.5 border transition flex items-center justify-between gap-3 active:scale-[0.99] ${
              isDone
                ? 'bg-[#EAE8D7] border-[#0D4A2E]/30'
                : 'bg-[#F3EFE2] border-white/90 shadow-soft-card'
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0 ${
                  isDone
                    ? 'bg-[#0D4A2E] text-[#F0D58C]'
                    : 'bg-[#DCE3C8] text-[#0D4A2E]'
                }`}
              >
                {isDone ? '✓' : lesson.number}
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                    Lesson {lesson.number} • {lesson.readTime || '3 min read'}
                  </span>
                </div>
                <h5 className="font-serif text-[15px] font-semibold text-primary truncate mt-0.5">
                  {lesson.title}
                </h5>
                <p className="text-[11.5px] text-secondary truncate">
                  {lesson.summary}
                </p>
              </div>
            </div>

            <span className="text-primary font-bold text-[16px] shrink-0 pr-1">
              ›
            </span>
          </button>
        );
      })}
    </div>
  );
}