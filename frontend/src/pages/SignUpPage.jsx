import { Eye, EyeOff, Lock, Mail, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const SignUpPage = () => {
  const { signup, isSignningUp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();
    if (success === true) {
      await signup(formData);
    }
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
            <h1 className='text-2xl font-bold mt-2'>အကောင့်ဖွင့်မည်</h1>
            <p className='text-base-content/60'>
              Free အကောင့်တစ်ခုဖြင့် စတင်လိုက်ပါ။
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-6 w-3/5'>
          <div className='form-control'>
            <label className='label mb-2'>
              <span className='label-text font-medium'>နာမည်အပြည့်အစုံ</span>
            </label>
            <div className='relative'>
              <div className='absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <User className='h-5 w-5 text-base-content/40' />
              </div>
              <input
                type='text'
                className={`input input-bordered w-full pl-10`}
                placeholder='သင့်နာမည်အပြည့်အစုံ ရိုက်ထည့်ပါ'
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
          </div>

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
                placeholder='လျှို့ဝှက်နံပါတ် တစ်ခုရိုက်ထည့်ပါ။'
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
            disabled={isSignningUp}>
            {isSignningUp ? (
              <>
                <span className='loading loading-spinner'></span>
                <span>အကောင့်ပြုလုပ်နေသည်...</span>
              </>
            ) : (
              "အကောင့်ပြုလုပ်မည်"
            )}
          </button>
        </form>

        <div className='text-center mt-2'>
          <p className='text-base-content/60'>
            အကောင့်တစ်ခုရှိပြီးပါက{" "}
            <Link to='/login' className='link link-primary'>
              အကောင့်ဝင်မည်
            </Link>
          </p>
        </div>
      </div>
      {/* Right */}
      <AuthImagePattern
        title='Join our community'
        subtitle='Connect with friends, share moments, and stay in touch with your loved ones.'
      />
    </div>
  );
};

export default SignUpPage;
