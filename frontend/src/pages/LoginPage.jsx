import { Eye, EyeOff, Lock, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(formData);
  };

  return (
    <div className='h-screen grid lg:grid-cols-2'>
      {/* left */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <div className='flex flex-col items-center gap-2 group'>
            <div
              className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors'>
              <MessageSquare className='w-6 h-6 text-primary' />
            </div>
            <h1 className='text-2xl font-bold mt-2'>ပြန်လည်ကြိုဆိုပါတယ်</h1>
            <p className='text-base-content/60'>
              သင့်အကောင့်ကို အခုပဲဝင်ရောက်လိုက်ပါ။
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-6 w-3/5'>
          <div className='form-control'>
            <label className='label mb-2'>
              <span className='label-text font-medium'>အီးမေးလ်</span>
            </label>
            <div className='relative'>
              <div className='absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Mail className='h-5 w-5 text-base-content/40' />
              </div>
              <input
                type='email'
                className={`input input-bordered w-full pl-10`}
                placeholder='သင့် အီးမေးလ် ကိုရိုက်ထည့်ပါ။'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className='form-control'>
            <label className='label mb-2'>
              <span className='label-text font-medium'>လျှို့ဝှက်နံပါတ်</span>
            </label>
            <div className='relative'>
              <div className='absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Lock className='h-5 w-5 text-base-content/40' />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className={`input input-bordered w-full px-10`}
                placeholder='သင့် လျှို့ဝှက်နံပါတ် ရိုက်ထည့်ပါ။'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type='button'
                className='absolute z-10 inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff className='h-5 w-5 text-base-content/40' />
                ) : (
                  <Eye className='h-5 w-5 text-base-content/40' />
                )}
              </button>
            </div>
          </div>

          <button
            type='submit'
            className='btn btn-primary w-full'
            disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <span className='loading loading-spinner'></span>
                <span>အကောင့်ဝင်နေသည်...</span>
              </>
            ) : (
              "အကောင့်ဝင်မည်"
            )}
          </button>
        </form>

        <div className='text-center mt-2'>
          <p className='text-base-content/60'>
            အကောင့်မရှိသေးပါက{" "}
            <Link to='/signup' className='link link-primary'>
              အကောင့်ပြုလုပ်မည်
            </Link>
          </p>
        </div>
      </div>
      {/* Right */}
      <AuthImagePattern
        title='Welcome Back'
        subtitle='Sign in to continue your conversations and catch up with your messages.'
      />
    </div>
  );
};

export default LoginPage;
