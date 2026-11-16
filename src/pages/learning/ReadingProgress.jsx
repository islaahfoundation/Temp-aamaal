//Displays the user's overall Islamic Learning Hub progress card, showing total completed lessons, courses in progress, and a quick "Resume Last Lesson" action

import React from 'react';

export default function ReadingProgress({
  courses = [],
  completedLessonsMap = {},
  lastActiveCourseId,
  onResumeCourse,
}) {
  // Calculate total lessons and completed lessons across all courses
  let totalLessonsCount = 0;
  let totalCompletedCount = 0;

  courses.forEach((course) => {
    const lessons = course.lessons || [];
    totalLessonsCount += lessons.length;
    const completedForCourse = completedLessonsMap[course.id] || [];
    totalCompletedCount += completedForCourse.length;
  });

  const overallPct =
    totalLessonsCount > 0
      ? Math.round((totalCompletedCount / totalLessonsCount) * 100)
      : 0;

  const activeCourse =
    courses.find((c) => c.id === lastActiveCourseId) || courses[0];

  const activeCompletedList = activeCourse
    ? completedLessonsMap[activeCourse.id] || []
    : [];

  const nextLessonNum = activeCourse
    ? Math.min(activeCompletedList.length + 1, activeCourse.lessons.length)
    : 1;

  return (
    <div className="card-progress rounded-[24px] p-4 mb-4 border border-[#C99E4C]/45 shadow-progress-card relative overflow-hidden">
      {/* Decorative Gold Corner Geometry */}
      <svg
        className="absolute right-0 top-0 w-28 h-28 opacity-20 pointer-events-none"
        viewBox="0 0 120 120"
        fill="none"
      >
        <circle
          cx="105"
          cy="15"
          r="45"
          stroke="#DFB75A"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="105" cy="15" r="28" stroke="#DFB75A" strokeWidth="1.2" />
      </svg>

      <div className="relative z-10 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
              Islamic Learning Progress
            </span>
            <h3 className="font-serif text-[20px] font-semibold text-white mt-1 leading-snug">
              {totalCompletedCount} of {totalLessonsCount} Lessons Completed
            </h3>
          </div>

          <div className="px-3 py-1.5 rounded-2xl bg-[#DFB75A]/20 border border-[#DFB75A]/45 text-center shrink-0">
            <span className="font-serif text-[17px] font-bold text-[#F0D58C] block leading-none">
              {overallPct}%
            </span>
            <span className="text-[9px] text-white/80 uppercase font-semibold">
              Mastery
            </span>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full h-2 rounded-full bg-black/25 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#DFB75A] to-[#F0D58C] transition-all duration-300"
            style={{ width: `${Math.max(overallPct, 6)}%` }}
          />
        </div>

        {/* Resume Current Course Footer */}
        {activeCourse && (
          <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] text-[#F0D58C] font-bold uppercase tracking-wider block">
                Continue Studying
              </span>
              <p className="text-[12.5px] text-white font-semibold truncate">
                {activeCourse.icon} {activeCourse.title} • Lesson {nextLessonNum}
              </p>
            </div>

            {onResumeCourse && (
              <button
                type="button"
                onClick={() => {
                  try {
                    if (navigator.vibrate) navigator.vibrate(10);
                  } catch (_) {}
                  onResumeCourse(activeCourse, nextLessonNum);
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#DFB75A] text-[#07361D] text-[11.5px] font-bold shrink-0 shadow-sm active:scale-95 transition"
              >
                Resume ›
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}