import { Camera, Send } from "lucide-react";
import { THEMES } from "../constants/index.js";
import useThemeStore from "../store/useThemeStore.jsx";

const PREVIEW_MESSAGES = [
  { id: 1, content: "ညဘက်တွေအေးလာတယ်နော်", isSent: true },
  {
    id: 2,
    content: "ဘာအေးတာလဲ။",
    isSent: false,
  },
  {
    id: 3,
    content: "မင်းတို့နှစ်ယောက်ရဲ့ ဆက်ဆံရေးလေ",
    isSent: true,
  },
  {
    id: 4,
    content: "😭😭😭",
    isSent: false,
  },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className='max-h-screen overflow-y-auto container mx-auto px-4 pt-20 pb-10 max-w-5xl scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-300'>
      <div className='space-y-6'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-lg font-semibold'>အပြင်အဆင်</h2>
          <p className='text-sm text-base-content/70'>
            ကြိုက်နှစ်သက်ရာ စကားပြောခန်း အပြင်အဆင် တစ်ခုကိုရွေးပါ။
          </p>
        </div>

        <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2'>
          {THEMES.map((t, i) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors cursor-pointer
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}>
              <div
                className='relative h-8 w-full rounded-md overflow-hidden'
                data-theme={t}>
                <div className='absolute inset-0 grid grid-cols-4 gap-px p-1'>
                  <div className='rounded bg-primary'></div>
                  <div className='rounded bg-secondary'></div>
                  <div className='rounded bg-accent'></div>
                  <div className='rounded bg-neutral'></div>
                </div>
              </div>
              <span className='text-[11px] font-medium truncate w-full text-center'>
                <span className='badge badge-primary badge-soft badge-xs mr-2'>
                  {i + 1}{" "}
                </span>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <div className='mockup-browser rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg'>
          <div className='mockup-browser-toolbar'>
            <div className='input py-2'>https://realtime-chat-app.com/</div>
          </div>
          <div className='p-4 bg-base-200'>
            <div className='max-w-lg mx-auto'>
              {/* Mock Chat UI */}
              <div className='bg-base-100 rounded-xl shadow-sm overflow-hidden'>
                {/* Chat Header */}
                <div className='px-4 py-3 border-b border-base-300 bg-base-100'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium'>
                      စ
                    </div>
                    <div>
                      <h3 className='font-semibold text-sm'>စော်ပြစ်ကောင်</h3>
                      <p className='text-xs text-base-content/70'>Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className='p-4 space-y-4 min-h-[200px] max-h-[600px] overflow-y-auto bg-base-100'>
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex font-medium ${
                        message.isSent ? "justify-end" : "justify-start"
                      }`}>
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${
                            message.isSent
                              ? "bg-primary text-primary-content"
                              : "bg-base-200"
                          }
                        `}>
                        <p className='text-sm'>{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${
                              message.isSent
                                ? "text-primary-content/70"
                                : "text-base-content/70"
                            }
                          `}>
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className='p-4 border-t border-base-300 bg-base-100'>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      className='input input-bordered flex-1 text-sm h-10'
                      placeholder='Type a message...'
                      value='🤣🤣🤣🤣'
                      readOnly
                    />
                    <button className='btn btn-primary h-10 min-h-0'>
                      <Camera size={18} />
                    </button>
                    <button className='btn btn-primary h-10 min-h-0'>
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* */}
      </div>
    </div>
  );
};

export default SettingsPage;
