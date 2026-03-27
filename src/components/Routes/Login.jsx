import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Google_Icon from '../../assets/Google_Icon.png';
import Logo from '../Tools/Logo';
import ButtonOutline from '../Tools/ButtonOutline';
import ButtonPrimary from '../Tools/ButtonPrimary';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, logoutThunk } from '../../app/features/auth/authThunks';
import { IsAuthed } from '../../app/features/auth/authSelectors';

export default function Login() {
  const isAuth = useSelector(IsAuthed);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleCancel = () => {
    navigate('/');
  };

  const toRegist = () => {
    navigate('/regist', { replace: true });
  };

  const handleLogin = async (data) => {
    if (isAuth) {
      await dispatch(logoutThunk());
      return;
    }

    if (!data.email?.trim() || !data.password?.trim()) {
      setError('email', { type: 'manual', message: '請輸入 Email' });
      setError('password', { type: 'manual', message: '請輸入密碼' });
      return;
    }

    const action = await dispatch(loginThunk({ email: data.email, password: data.password }));
    if (loginThunk.fulfilled.match(action)) {
      if (window.history.length > 1) {
        navigate(-1);
        return;
      }
      navigate('/');
      reset();
    } else {
      setError('email', { type: 'manual', message: '帳號輸入錯誤，請重新輸入' });
      setError('password', { type: 'manual', message: '密碼輸入錯誤，請重新輸入' });
    }
  };

  return (
    <div className="route-overlay" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
      <div className="route-overlay__card bg-bgc">
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={handleCancel}
          ></button>
        </div>
        <div className="text-center font-zh-tw">
          <Logo className="header-logo mx-auto"></Logo>
          <h3 className="my-32 my-md-48" id="loginTitle">
            立即登入，解鎖完整功能
          </h3>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="d-flex flex-column gap-24 align-items-center"
          >
            <ButtonOutline
              type="button"
              className="d-flex justify-content-center align-items-center py-8 px-16"
            >
              <img src={Google_Icon} className="me-8 icon-24" alt="Google-icon" />
              <h6 className="m-0">使用 Google 帳號快速登入</h6>
            </ButtonOutline>

            <div className="w-100">
              <h6 className="text-start mb-8">帳號</h6>
              <div className="form-floating">
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="accountInput"
                  autoComplete="username"
                  placeholder="請輸入信箱"
                  {...register('email', {
                    required: '請輸入 Email',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Email 格式不正確',
                    },
                    onChange: () => clearErrors('email'),
                  })}
                />
                <label htmlFor="accountInput">請輸入信箱</label>
                {errors.email && (
                  <div className="invalid-feedback text-start">{errors.email.message}</div>
                )}
              </div>
            </div>
            <div className="w-100">
              <h6 className="text-start mb-8">密碼</h6>
              <div className="form-floating">
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="passwordInput"
                  autoComplete="current-password"
                  placeholder="請輸入密碼"
                  {...register('password', {
                    required: '請輸入密碼',
                    minLength: {
                      value: 4,
                      message: '密碼至少需要 4 個字元',
                    },
                    onChange: () => clearErrors('password'),
                  })}
                />
                <label htmlFor="passwordInput">請輸入密碼</label>
                {errors.password && (
                  <div className="invalid-feedback text-start">{errors.password.message}</div>
                )}
              </div>
            </div>
            <ButtonPrimary type="submit" className="py-12 px-40 round-8">
              {isAuth ? '登出' : '登入'}
            </ButtonPrimary>
            <div className="d-flex align-items-center gap-12">
              <p className="m-0">沒有帳號？</p>
              <button type="button" className="btn btn-link p-0 link-primary" onClick={toRegist}>
                立即註冊
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

