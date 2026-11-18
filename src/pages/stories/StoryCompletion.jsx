//Renders the celebration screen when a user finishes all chapters of a story, awarding a session milestone, offering a one-tap WhatsApp/clipboard share of the story's key takeaway, and linking back to the Stories library.

import React, { useState } from 'react';

export default function StoryCompletion({
  story,
  onRestartStory,
  onBrowseMoreStories,
}) {
  const [copied, setCopied] = useState(false);

  if (!story) return null;

  const finalTakeaway =
    story.chapters?.[story.chapters.length - 1]?.takeaway ||
    'Consistent remembrance and noble character illuminate the believer’s path.';

  const handleShare = async () => {
    const shareText = [
      `🕌 *Aamaal Circle • Story Completed*`,
      `📖 *${story.title}* (${story.subtitle})`,
      '',
      story.arabic || '',
      story.translations?.en || '',
      '',
      `✨ Key Takeaway: ${finalTakeaway}`,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      if (navigator.share) {
        await navigator.share({ title: story.title, text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (_) {}
  };

  return (
    <div className="space-y-4 fade-in">
      <div className="card-progress rounded-[24px] p-6 text-center border border-[#C99E4C]/50 shadow-progress-card space-y-3.5">
        <div className="w-16 h-16 rounded-full bg-[#DFB75A]/20 border-2 border-[#DFB75A] flex items-center justify-center mx-auto text-[28px]">
          🌟
        </div>

        <span className="px-3 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[10px] font-bold uppercase tracking-wider">
          Alhamdulillah • Story Completed
        </span>

        <h2 className="font-serif text-[24px] font-bold text-white leading-tight">
          {story.title}
        </h2>

        <p className="text-[12.5px] text-white/85 max-w-[270px] mx-auto leading-relaxed">
          You have completed all {(story.chapters || []).length} chapters of this journey. May its lessons take root in your daily Aamaal.
        </p>

        <div className="rounded-2xl bg-black/20 p-3.5 border border-white/15 text-left">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#F0D58C] block mb-1">
            ✨ Final Heart Takeaway
          </span>
          <p className="text-[12.5px] text-white/95 leading-relaxed">
            {finalTakeaway}
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-2.5 rounded-full bg-[#DFB75A] text-[#07361D] text-[12.5px] font-bold shadow-sm"
          >
            {copied ? '✓ Copied Summary' : '📲 Share Takeaway'}
          </button>

          {onRestartStory && (
            <button
              type="button"
              onClick={onRestartStory}
              className="px-4 py-2.5 rounded-full bg-white/15 text-white border border-white/25 text-[12px] font-semibold"
            >
              ↻ Read Again
            </button>
          )}
        </div>
      </div>

      {onBrowseMoreStories && (
        <button
          type="button"
          onClick={onBrowseMoreStories}
          className="btn-primary w-full py-3.5 text-[13.5px] font-semibold shadow-md"
        >
          ‹ Explore More Stories &amp; Reflections
        </button>
      )}
    </div>
  );
}