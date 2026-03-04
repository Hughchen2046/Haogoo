import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as bootstrap from 'bootstrap';
import Logo from '../Tools/Logo';
import ButtonPrimary from '../Tools/ButtonPrimary';
import { useAuth } from '../../contexts/AuthContext';

export default function Regist() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const toastRef = useRef(null);
  const registToastRef = useRef(null);

  const {
    register,
    handleSubmit,
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

  const toLogin = () => {
    navigate('/login', { replace: true });
  };

  const onSubmit = async (data) => {
    const submitData = {
      email: data.email,
      password: data.password,
      name: data.name,
      createdAt: new Date().toLocaleString(),
    };

    const { success, error, data: responseData } = await registerAuth(submitData);

    if (success) {
      console.log('註冊伺服器回應：', responseData);
      if (toastRef.current) {
        registToastRef.current = new bootstrap.Toast(toastRef.current);
        registToastRef.current.show();
      }
      setTimeout(() => {
        registToastRef.current?.hide();
        navigate('/login', { replace: true });
      }, 1000);
      return;
    }

    const errText = typeof error === 'string' ? error : JSON.stringify(error);
    if (errText.toLowerCase().includes('email')) {
      setError('email', { type: 'manual', message: 'Email 已被使用或格式錯誤' });
    } else if (errText.toLowerCase().includes('password') || errText.includes('密碼')) {
      setError('password', { type: 'manual', message: '密碼格式不符合要求' });
    } else {
      setError('email', { type: 'manual', message: '註冊失敗，請稍後再試' });
    }
  };

  return (
    <div className="route-overlay" role="dialog" aria-modal="true" aria-labelledby="registTitle">
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
          <h3 className="my-32 my-md-48" id="registTitle">
            立即註冊，解鎖完整功能
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="d-flex flex-column gap-24 align-items-center"
            noValidate
          >
            <div className="w-100">
              <h6 className="text-start mb-8">Email帳號</h6>
              <div className="form-floating">
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="registEmailInput"
                  placeholder="請輸入信箱"
                  {...register('email', {
                    required: '請輸入正確 Email',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Email 格式不正確',
                    },
                    onChange: () => clearErrors('email'),
                  })}
                />
                <label htmlFor="registEmailInput">請輸入信箱</label>
                {errors.email && (
                  <div className="invalid-feedback text-start">{errors.email.message}</div>
                )}
              </div>
            </div>

            <div className="w-100">
              <h6 className="text-start mb-8">暱稱</h6>
              <div className="form-floating">
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="registNicknameInput"
                  placeholder="請輸入暱稱"
                  {...register('name', {
                    required: '請輸入暱稱',
                    maxLength: {
                      value: 20,
                      message: '暱稱最多 20 個字元',
                    },
                    onChange: () => clearErrors('name'),
                  })}
                />
                <label htmlFor="registNicknameInput">請輸入暱稱</label>
                {errors.name && (
                  <div className="invalid-feedback text-start">{errors.name.message}</div>
                )}
              </div>
            </div>

            <div className="w-100">
              <h6 className="text-start mb-8">密碼</h6>
              <div className="form-floating">
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="registPasswordInput"
                  placeholder="請輸入密碼"
                  {...register('password', {
                    required: '請輸入正確密碼',
                    minLength: {
                      value: 4,
                      message: '密碼至少需要 4 個字元',
                    },
                    maxLength: {
                      value: 20,
                      message: '密碼最多 20 個字元',
                    },
                    onChange: () => clearErrors('password'),
                  })}
                />
                <label htmlFor="registPasswordInput">請輸入密碼（4-20 字元）</label>
                {errors.password && (
                  <div className="invalid-feedback text-start">{errors.password.message}</div>
                )}
              </div>
            </div>

            <div className="form-check w-100 text-start position-relative">
              <input
                type="checkbox"
                className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                id="termsCheck"
                {...register('terms', {
                  required: '需同意服務條款',
                })}
              />
              <label className="form-check-label" htmlFor="termsCheck">
                我同意服務條款與隱私政策
              </label>
              {errors.terms && <div className="invalid-feedback">{errors.terms.message}</div>}
              <div
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="toast font-zh-tw round-12 overflow-hidden position-absolute top-0 start-50 translate-middle-x"
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
                <div className="toast-body bg-gray-100">註冊成功，請直接登入</div>
              </div>
            </div>

            <ButtonPrimary type="submit" className="py-12 px-40 round-8">
              註冊
            </ButtonPrimary>

            <div className="d-flex  align-items-center gap-12">
              <p className="m-0">已有帳號？</p>
              <button type="button" className="btn btn-link p-0 link-primary" onClick={toLogin}>
                立即登入
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
