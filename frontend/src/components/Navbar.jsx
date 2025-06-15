import { LogOut, MessageSquare, Settings, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";

const Navbar = () => {
  const { logout, isLoggingOut, authUser } = useAuthStore();
  const { theme } = useThemeStore();

  return (
    <nav
      className='border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80'>
      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full'>
          <div className='flex items-center gap-2'>
            <Link to='/'>
              <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                <MessageSquare className='size-5 text-primary' />
              </div>
            </Link>
            <h1 className='text-2xl font-bold text-primary'>ချက်မယ်</h1>
          </div>

          <div className='flex items-center gap-4'>
            <div className='tooltip tooltip-left' data-tip={theme}>
              <div className='hidden w-fit rounded-md bg-base-200 px-2 py-1 md:block'>
                <div className='w-full h-full grid grid-cols-4 gap-px p-1'>
                  <div className='size-4 rounded bg-primary'></div>
                  <div className='size-4 rounded bg-secondary'></div>
                  <div className='size-4 rounded bg-accent'></div>
                  <div className='size-4 rounded bg-neutral'></div>
                </div>
              </div>
            </div>
            <Link to='/settings' className='btn btn-sm gap-2 transition-colors'>
              <Settings className='size-4' />
              <p className='text-md hidden sm:block'>စက်တင်များ</p>
            </Link>
            {authUser && (
              <>
                <Link
                  to='/profile'
                  className='btn btn-sm gap-2 transition-colors'>
                  <UserCircle className='size-4' />
                  <p className='text-md hidden sm:block'>ပရိုဖိုင်</p>
                </Link>
                <button
                  onClick={logout}
                  className='btn btn-sm gap-2 transition-colors'
                  disabled={isLoggingOut}>
                  {isLoggingOut ? (
                    <>
                      <span className='loading loading-spinner size-4'></span>
                      <p className='text-md hidden sm:block'>
                        အကောင့်ထွက်နေသည်
                      </p>
                    </>
                  ) : (
                    <>
                      <LogOut className='size-4' />
                      <p className='text-md hidden sm:block'>အကောင့်ထွက်မည်</p>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
