//Displays the selected course overview card, learning objectives, completion bar, reset course button, and embeds LessonList.jsx

import React from 'react';
import LessonList from './LessonList';

export default function CourseDetails({
  course,
  completedLessonNumbers = [],
  onSelectLesson,
  onResetCourseProgress,
  onBack,
}) {
  if (!course) return null;

  const totalLessons = (course.lessons || []).length;
  const doneCount = completedLessonNumbers.length;
  const pct =
    totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0;

  const nextLesson =
    (course.lessons || []).find(
      (l) => !completedLessonNumbers.includes(l.number)
    ) || course.lessons[0];

  return (
    <div className="space-y-4 fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
          >
            ‹ All Courses
          </button>
        )}

        {doneCount > 0 && onResetCourseProgress && (
          <button
            type="button"
            onClick={() => onResetCourseProgress(course.id)}
            className="px-3 py-1 rounded-full bg-[#EAE8D7] text-secondary text-[11px] font-semibold"
          >
            Reset Progress
          </button>
        )}
      </div>

      {/* Course Hero Card */}
      <div className="card-progress rounded-[22px] p-4 border border-[#C99E4C]/45 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-[#C99E4C]/40 flex items-center justify-center text-[24px] shrink-0">
              {course.icon}
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-[#DFB75A]/20 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
                {course.category}
              </span>
              <h2 className="font-serif text-[20px] font-semibold text-white mt-0.5 leading-snug">
                {course.title}
              </h2>
            </div>
          </div>
        </div>

        <p className="text-[12px] text-white/85 leading-relaxed">
          {course.description}
        </p>

        {/* Progress Bar */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[11px] text-white/85 mb-1">
            <span>
              {doneCount} of {totalLessons} Lessons Completed
            </span>
            <strong className="text-[#F0D58C]">{pct}%</strong>
          </div>
          <div className="w-full h-2 rounded-full bg-black/25 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#DFB75A] to-[#F0D58C] transition-all duration-300"
              style={{ width: `${Math.max(pct, 6)}%` }}
            />
          </div>
        </div>

        {nextLesson && (
          <button
            type="button"
            onClick={() => onSelectLesson && onSelectLesson(nextLesson)}
            className="w-full py-2.5 rounded-full bg-[#DFB75A] text-[#07361D] text-[12.5px] font-bold shadow-sm mt-2"
          >
            {doneCount === 0
              ? `Start Lesson 1: ${nextLesson.title} ›`
              : `Continue Lesson ${nextLesson.number}: ${nextLesson.title} ›`}
          </button>
        )}
      </div>

      {/* Syllabus List */}
      <LessonList
        lessons={course.lessons || []}
        completedLessonNumbers={completedLessonNumbers}
        onSelectLesson={onSelectLesson}
      />
    </div>
  );
}