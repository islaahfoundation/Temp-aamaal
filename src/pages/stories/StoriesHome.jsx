//The master controller for src/pages/stories/ uniting all 12 components (StoryCategories, ContinueStory, QuranReflection, HadithReflection, DailyReminderViewer, ReflectionViewer, IllustratedStoryViewer, StoryDetails, StoryCompletion, StoryBookmarks, and ReadingHistory) with localStorage synchronization.

import React, { useState, useEffect } from 'react';
import StoryCategories, { DEFAULT_STORIES_LIBRARY } from './StoryCategories';
import ContinueStory from './ContinueStory';
import QuranReflection from './QuranReflection';
import HadithReflection from './HadithReflection';
import DailyReminderViewer from './DailyReminderViewer';
import ReflectionViewer from './ReflectionViewer';
import IllustratedStoryViewer from './IllustratedStoryViewer';
import StoryDetails from './StoryDetails';
import StoryCompletion from './StoryCompletion';
import StoryBookmarks from './StoryBookmarks';
import ReadingHistory from './ReadingHistory';

const STORIES_STORAGE_KEY = 'aamaal_stories_state_v1';

export default function StoriesHome({
  state,
  updateState,
  onShowToast,
  onBack,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('home');
  // 'home' | 'details' | 'slideshow' | 'completion' | 'reflection' | 'bookmarks' | 'history'

  const [selectedStory, setSelectedStory] = useState(null);
  const [activeChapterNum, setActiveChapterNum] = useState(1);
  const [selectedReflection, setSelectedReflection] = useState(null);

  const [storiesData, setStoriesData] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORIES_STORAGE_KEY) || 'null'
      );
      if (saved && typeof saved === 'object') return saved;
    } catch (_) {}
    return {
      bookmarkedIds: ['valley-of-makkah'],
      chapterProgress: {
        'valley-of-makkah': state?.storyLesson || 2,
      },
      historyLogs: [],
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(storiesData));
    } catch (_) {}
  }, [storiesData]);

  const handleToggleBookmark = (storyId) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}

    setStoriesData((prev) => {
      const list = prev.bookmarkedIds || [];
      const exists = list.includes(storyId);
      const nextIds = exists
        ? list.filter((id) => id !== storyId)
        : [...list, storyId];
      if (onShowToast) {
        onShowToast(
          exists ? 'Removed from story bookmarks' : 'Saved to story bookmarks'
        );
      }
      return {
        ...prev,
        bookmarkedIds: nextIds,
      };
    });
  };

  const handleChapterComplete = (storyId, chapterNum) => {
    const storyObj = DEFAULT_STORIES_LIBRARY.find((s) => s.id === storyId);
    const totalChapters = storyObj?.chapters?.length || 6;
    const nextChapter = Math.min(chapterNum + 1, totalChapters);

    setStoriesData((prev) => ({
      ...prev,
      chapterProgress: {
        ...(prev.chapterProgress || {}),
        [storyId]: nextChapter,
      },
      historyLogs: [
        {
          id: `shist_${Date.now()}`,
          type: 'Chapter Completed',
          title: `${storyObj?.title || 'Story'} • Chapter ${chapterNum}`,
          timestamp: new Date().toISOString(),
        },
        ...(prev.historyLogs || []),
      ],
    }));

    if (storyId === 'valley-of-makkah' && updateState) {
      updateState({ storyLesson: nextChapter });
    }
  };

  const handleFinishStory = (storyObj) => {
    setStoriesData((prev) => ({
      ...prev,
      historyLogs: [
        {
          id: `shist_${Date.now()}`,
          type: 'Full Story Completed',
          title: storyObj.title,
          timestamp: new Date().toISOString(),
        },
        ...(prev.historyLogs || []),
      ],
    }));

    if (updateState) {
      updateState((prev) => ({
        ...prev,
        sessionsCount: (prev.sessionsCount || 0) + 1,
      }));
    }

    setSelectedStory(storyObj);
    setViewMode('completion');
    if (onShowToast) {
      onShowToast(`MashaAllah! Completed "${storyObj.title}"!`);
    }
  };

  const handleSaveReflectionNote = (title, noteText) => {
    setStoriesData((prev) => ({
      ...prev,
      historyLogs: [
        {
          id: `shist_${Date.now()}`,
          type: 'Personal Reflection',
          title,
          note: noteText,
          timestamp: new Date().toISOString(),
        },
        ...(prev.historyLogs || []),
      ],
    }));
    if (onShowToast) onShowToast('Saved reflection note to Reading History');
  };

  // Sub-screens routing
  if (viewMode === 'details' && selectedStory) {
    return (
      <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
        <StoryDetails
          story={selectedStory}
          initialChapter={activeChapterNum}
          isBookmarked={(storiesData.bookmarkedIds || []).includes(
            selectedStory.id
          )}
          onToggleBookmark={handleToggleBookmark}
          onChapterComplete={handleChapterComplete}
          onFinishStory={handleFinishStory}
          onOpenSlideshow={(chNum) => {
            setActiveChapterNum(chNum);
            setViewMode('slideshow');
          }}
          onBack={() => setViewMode('home')}
        />
      </section>
    );
  }

  if (viewMode === 'slideshow' && selectedStory) {
    return (
      <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
        <IllustratedStoryViewer
          story={selectedStory}
          initialChapter={activeChapterNum}
          onCompleteStory={handleFinishStory}
          onSwitchToReader={(chNum) => {
            setActiveChapterNum(chNum);
            setViewMode('details');
          }}
          onBack={() => setViewMode('home')}
        />
      </section>
    );
  }

  if (viewMode === 'completion' && selectedStory) {
    return (
      <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
        <StoryCompletion
          story={selectedStory}
          onRestartStory={() => {
            setActiveChapterNum(1);
            setViewMode('details');
          }}
          onBrowseMoreStories={() => setViewMode('home')}
        />
      </section>
    );
  }

  if (viewMode === 'reflection' && selectedReflection) {
    return (
      <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
        <ReflectionViewer
          reflection={selectedReflection}
          onSavePersonalNote={handleSaveReflectionNote}
          onBack={() => setViewMode('home')}
        />
      </section>
    );
  }

  if (viewMode === 'bookmarks') {
    return (
      <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
        <StoryBookmarks
          stories={DEFAULT_STORIES_LIBRARY}
          bookmarkedIds={storiesData.bookmarkedIds || []}
          onSelectStory={(storyObj) => {
            setSelectedStory(storyObj);
            setActiveChapterNum(
              storiesData.chapterProgress?.[storyObj.id] || 1
            );
            setViewMode('details');
          }}
          onToggleBookmark={handleToggleBookmark}
          onBack={() => setViewMode('home')}
        />
      </section>
    );
  }

  if (viewMode === 'history') {
    return (
      <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
        <ReadingHistory
          historyLogs={storiesData.historyLogs || []}
          onClearHistory={() => {
            setStoriesData((prev) => ({ ...prev, historyLogs: [] }));
            if (onShowToast) onShowToast('Reading history cleared');
          }}
          onBack={() => setViewMode('home')}
        />
      </section>
    );
  }

  const filteredStories = DEFAULT_STORIES_LIBRARY.filter(
    (s) =>
      activeCategory === 'all' ||
      s.category.toLowerCase() === activeCategory.toLowerCase()
  );

  const primaryStory = DEFAULT_STORIES_LIBRARY[0]; // The Valley of Makkah
  const currentMakkahChapter =
    storiesData.chapterProgress?.['valley-of-makkah'] ||
    state?.storyLesson ||
    2;

  return (
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6 space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary px-3 py-1 text-[11.5px]"
            >
              ‹ Back
            </button>
          )}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
              Seerah &amp; Sacred Wisdom
            </span>
            <h2 className="font-serif text-[23px] font-semibold text-primary leading-tight">
              Stories &amp; Reflections
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setViewMode('bookmarks')}
            className="px-2.5 py-1.5 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11px] font-bold"
          >
            🔖 ({(storiesData.bookmarkedIds || []).length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('history')}
            className="px-2.5 py-1.5 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11px] font-bold"
          >
            📜 Log
          </button>
        </div>
      </div>

      {/* 1. Continue Reading Hero Card ("The Valley of Makkah") */}
      <ContinueStory
        story={primaryStory}
        currentChapter={currentMakkahChapter}
        onResumeStory={(storyObj, chNum) => {
          setSelectedStory(storyObj);
          setActiveChapterNum(chNum);
          setViewMode('details');
        }}
        onOpenIllustratedMode={(storyObj, chNum) => {
          setSelectedStory(storyObj);
          setActiveChapterNum(chNum);
          setViewMode('slideshow');
        }}
      />

      {/* 2. Category Filter Bar */}
      <StoryCategories
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* 3. Illustrated Stories List */}
      <div className="space-y-2.5">
        {filteredStories.map((story) => {
          const isSaved = (storiesData.bookmarkedIds || []).includes(story.id);
          const chProgress = storiesData.chapterProgress?.[story.id] || 1;

          return (
            <div
              key={story.id}
              onClick={() => {
                setSelectedStory(story);
                setActiveChapterNum(chProgress);
                setViewMode('details');
              }}
              className="card rounded-[20px] p-3.5 flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99] transition"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-20 h-16 rounded-[14px] object-cover shrink-0 border border-[#D5D2BE]"
                />
                <div className="min-w-0">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-gold">
                    {story.category} • {story.readTime}
                  </span>
                  <h4 className="font-serif text-[16px] font-semibold text-primary truncate mt-0.5">
                    {story.title}
                  </h4>
                  <p className="text-[11px] text-secondary truncate">
                    {story.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleBookmark(story.id);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isSaved
                    ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#C99E4C]'
                    : 'bg-[#EAE8D7] text-primary border-[#D5D2BE]'
                }`}
              >
                🔖
              </button>
            </div>
          );
        })}
      </div>

      {/* 4. Daily Quranic Tadabbur Reflection */}
      <QuranReflection
        onOpenFullReflection={(refObj) => {
          setSelectedReflection(refObj);
          setViewMode('reflection');
        }}
      />

      {/* 5. Daily Prophetic Hadith Reflection */}
      <HadithReflection
        onOpenFullReflection={(refObj) => {
          setSelectedReflection(refObj);
          setViewMode('reflection');
        }}
      />

      {/* 6. Daily & Thursday Salawat Interactive Reminder Viewer */}
      <DailyReminderViewer
        onCompletedSalawat={(cnt) => {
          if (updateState) {
            updateState((prev) => ({
              ...prev,
              dhikrCount: (prev.dhikrCount || 0) + cnt,
            }));
          }
          if (onShowToast) {
            onShowToast('Alhamdulillah! Completed 6 Salawat');
          }
        }}
      />
    </section>
  );
}