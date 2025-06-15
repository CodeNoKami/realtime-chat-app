import { Palette } from "lucide-react";
import toast from "react-hot-toast";
import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("rca-theme") || "light",
  setTheme: (theme) => {
    localStorage.setItem("rca-theme", theme);
    set({ theme });
    toast(() => (
      <div className='flex items-center gap-2'>
        <Palette className='size-5 text-primary' />
        <span>
          Theme switched to <b className='text-primary'>{theme}</b>
        </span>
      </div>
    ));
  },
}));

export default useThemeStore;
