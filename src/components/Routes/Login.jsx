import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as bootstrap from 'bootstrap';
import Google_Icon from '../../assets/Google_Icon.png';
import Logo from '../Tools/Logo';
import ButtonOutline from '../Tools/ButtonOutline';
import ButtonPrimary from '../Tools/ButtonPrimary';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { isAuth, login, logout } = useAuth();

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

  const handleLogin = async (data) => {
    if (isAuth) {
      logout();
      alert('已登出');
      return;
    }

    // 防禦性檢查：確保資料不為空（雙重保險）
    if (!data.email?.trim() || !data.password?.trim()) {
      setError('email', { type: 'manual', message: '請輸入 Email' });
      setError('password', { type: 'manual', message: '請輸入密碼' });
      return;
    }

    const { success } = await login({ email: data.email, password: data.password });

    if (success) {
      alert('登入成功');
      reset();
    } else {
      setError('email', { type: 'manual', message: '帳號輸入錯誤，請重新輸入' });
      setError('password', { type: 'manual', message: '密碼輸入錯誤，請重新輸入' });
    }
  };

  const nextModalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  const handleSwitch = (targetId) => {
    nextModalRef.current = targetId;
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      // Use existing instance from ref or get existing instance
      const modalInstance = modalInstanceRef.current || bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById('loginModal');
    if (!modalElement) return;

    // Check if instance already exists (created by data-bs-toggle)
    let modalInstance = bootstrap.Modal.getInstance(modalElement);

    // Only create if it doesn't exist
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalElement);
    }

    // Store instance in ref for later use
    modalInstanceRef.current = modalInstance;

    const handleHide = () => {
      // 在 Modal 開始關閉時立即移除焦點，修復 aria-hidden 警告
      if (document.activeElement && modalElement.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    };

    const handleHidden = () => {
      // Modal 關閉時重置表單
      reset();
      clearErrors();
      document.querySelector('.modal-backdrop')?.remove();
      document.body.style.overflow = '';

      if (nextModalRef.current) {
        const nextEl = document.getElementById(nextModalRef.current);
        if (nextEl) {
          // Use getInstance to avoid creating duplicate instances
          let nextInstance = bootstrap.Modal.getInstance(nextEl);
          if (!nextInstance) {
            nextInstance = new bootstrap.Modal(nextEl);
          }
          nextInstance.show();
        }
        nextModalRef.current = null;
      }
    };

    const handleShown = () => {
      // Modal 打開時只聚焦，不重置
      document.getElementById('accountInput')?.focus();
    };

    modalElement.addEventListener('hide.bs.modal', handleHide);
    modalElement.addEventListener('hidden.bs.modal', handleHidden);
    modalElement.addEventListener('shown.bs.modal', handleShown);

    return () => {
      // Cleanup: remove event listeners
      modalElement.removeEventListener('hide.bs.modal', handleHide);
      modalElement.removeEventListener('hidden.bs.modal', handleHidden);
      modalElement.removeEventListener('shown.bs.modal', handleShown);

      // Dispose modal instance on unmount
      const instance = bootstrap.Modal.getInstance(modalElement);
      if (instance) {
        instance.dispose();
      }
      modalInstanceRef.current = null;
    };
  }, [reset, clearErrors]);

  useEffect(() => {
    if (isAuth) {
      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
        closeButton?.click();
      }

      const offcanvasElement = document.getElementById('mobileMenu');
      if (offcanvasElement) {
        const offcanvasCloseButton = offcanvasElement.querySelector(
          '[data-bs-dismiss="offcanvas"]'
        );
        offcanvasCloseButton?.click();
      }
    }
  }, [isAuth]);

  return (
    <>
      <div
        className="modal fade "
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen-sm-down">
          <div className="modal-content bg-bgc">
            <div className="modal-header border-0 ">
              <h1 className="modal-title fs-5" id="loginLabel"></h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center font-zh-tw">
              <Logo className="header-logo mx-auto"></Logo>
              <h3 className=" my-32 my-md-48">立即登入，解鎖完整功能</h3>
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
                <p className="caption">或</p>
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
                <div className="d-flex">
                  <p>沒有帳號？</p>
                  <a href="#" className="link-primary" onClick={() => handleSwitch('registModal')}>
                    立即註冊
                  </a>
                </div>
              </form>
              <a
                href="#"
                className="d-inline-block mb-8"
                onClick={() => handleSwitch('forgetPWModal')}
              >
                忘記密碼?
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
