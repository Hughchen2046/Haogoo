import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as bootstrap from 'bootstrap';
import Google_Icon from '../../assets/Google_Icon.png';
import Logo from '../Tools/Logo';
import ButtonOutline from '../Tools/ButtonOutline';
import ButtonPrimary from '../Tools/ButtonPrimary';
import { useAuth } from '../../contexts/AuthContext';

import { useDispatch, useSelector } from 'react-redux';

export default function Login() {
  const { isAuth, login, logout } = useAuth();
  const navigate = useNavigate();
  const toastRef = useRef(null);
  const loginToastRef = useRef(null);
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
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const handleCancel = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  const toRegist = () => {
    navigate('/regist', { replace: true });
  };

  const handleLogin = async (data) => {
    if (isAuth) {
      logout();
      return;
    }

    if (!data.email?.trim() || !data.password?.trim()) {
      setError('email', { type: 'manual', message: '請輸入 Email' });
      setError('password', { type: 'manual', message: '請輸入密碼' });
      return;
    }

    const { success } = await login({ email: data.email, password: data.password });

    if (success) {
      reset();
      if (toastRef.current) {
        loginToastRef.current = new bootstrap.Toast(toastRef.current);
        loginToastRef.current.show();
      }
      setTimeout(() => {
        loginToastRef.current?.hide();
        if (window.history.length > 1) {
          navigate(-1);
          return;
        }
        navigate('/');
      }, 1000);
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

            <div className="w-100 position-relative">
              <p className="caption">或</p>
              <div
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="toast font-zh-tw round-12 overflow-hidden position-absolute z-2 w-100 top-0 start-50 translate-middle-x"
                ref={toastRef}
              >
                <div className="toast-header bg-primary text-white">
                  <strong className="me-auto">HaoGoo</strong>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="toast-body bg-gray-100 py-24">登入成功</div>
              </div>
            </div>

            <div className="w-100">
              <h6 className="text-start mb-8">帳號</h6>
              <div className="form-floating">
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="accountInput"
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
