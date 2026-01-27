import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Logo from '../Tools/Logo';
import ButtonPrimary from '../Tools/ButtonPrimary';
import { useAuth } from '../../contexts/AuthContext';
import * as bootstrap from 'bootstrap';

export default function Regist() {
  const [isRegist, setIsRegist] = React.useState(false);
  const nextModalRef = useRef(null);
  const modalInstanceRef = useRef(null);
  const { register: registerAuth } = useAuth();

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

  const handleSwitch = (targetId) => {
    nextModalRef.current = targetId;
    const modalElement = document.getElementById('registModal');
    if (modalElement) {
      const modalInstance = modalInstanceRef.current || bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  };

  const onSubmit = async (data) => {
    // 防禦性檢查：確保資料不為空（雙重保險）
    if (!data.email?.trim() || !data.password?.trim() || !data.name?.trim()) {
      if (!data.email?.trim()) {
        setError('email', { type: 'manual', message: '請輸入 Email' });
      }
      if (!data.password?.trim()) {
        setError('password', { type: 'manual', message: '請輸入密碼' });
      }
      if (!data.name?.trim()) {
        setError('name', { type: 'manual', message: '請輸入暱稱' });
      }
      if (!data.terms) {
        setError('terms', { type: 'manual', message: '請同意條款' });
      }
      return;
    }

    const submitData = {
      email: data.email,
      password: data.password,
      name: data.name,
      createdAt: new Date().toLocaleString(),
    };

    const { success, error, data: responseData } = await registerAuth(submitData);

    if (success) {
      console.log('註冊伺服器回應：', responseData);
      alert('註冊成功');
      setIsRegist(true);

      window.dispatchEvent(
        new CustomEvent('registSuccess', {
          detail: { nickname: submitData.name },
        })
      );
    } else {
      console.error('註冊出錯細節：', error);
      // 設定具體的錯誤訊息到各欄位
      if (error?.includes('email') || error?.includes('Email')) {
        setError('email', { type: 'manual', message: 'Email 已被使用或格式錯誤' });
      } else if (error?.includes('password') || error?.includes('密碼')) {
        setError('password', { type: 'manual', message: '密碼格式不符合要求' });
      } else {
        setError('email', { type: 'manual', message: '註冊失敗，請稍後再試' });
      }
      setIsRegist(false);
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById('registModal');
    if (!modalElement) return;

    // Check if instance already exists (created by data-bs-toggle)
    let modalInstance = bootstrap.Modal.getInstance(modalElement);

    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalElement);
    }

    modalInstanceRef.current = modalInstance;

    const handleHide = () => {
      // 在 Modal 開始關閉時立即移除焦點，修復 aria-hidden 警告
      if (document.activeElement && modalElement.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    };

    const handleHidden = () => {
      // Modal 關閉時重置表單並清除錯誤
      reset();
      clearErrors();
      setIsRegist(false);
      document.querySelector('.modal-backdrop')?.remove();
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      if (nextModalRef.current) {
        const nextEl = document.getElementById(nextModalRef.current);
        if (nextEl) {
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
      document.getElementById('registEmailInput')?.focus();
    };

    modalElement.addEventListener('hide.bs.modal', handleHide);
    modalElement.addEventListener('hidden.bs.modal', handleHidden);
    modalElement.addEventListener('shown.bs.modal', handleShown);

    return () => {
      modalElement.removeEventListener('hide.bs.modal', handleHide);
      modalElement.removeEventListener('hidden.bs.modal', handleHidden);
      modalElement.removeEventListener('shown.bs.modal', handleShown);

      const instance = bootstrap.Modal.getInstance(modalElement);
      if (instance) {
        instance.dispose();
      }
      modalInstanceRef.current = null;
    };
  }, [reset, clearErrors]);

  useEffect(() => {
    if (isRegist) {
      const modalElement = document.getElementById('registModal');
      if (modalElement) {
        const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
        closeButton?.click();
      }
    }
  }, [isRegist]);

  return (
    <>
      <div
        className="modal fade"
        id="registModal"
        tabIndex="-1"
        aria-labelledby="registLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen-sm-down">
          <div className="modal-content bg-bgc">
            <div className="modal-header border-0 ">
              <h1 className="modal-title fs-5" id="registLabel"></h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center font-zh-tw">
              <Logo className="header-logo mx-auto"></Logo>
              <h3 className="my-32 my-md-48">立即註冊，解鎖完整功能</h3>
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
                      })}
                    />
                    <label htmlFor="registPasswordInput">請輸入密碼（4-20 字元）</label>
                    {errors.password && (
                      <div className="invalid-feedback text-start">{errors.password.message}</div>
                    )}
                  </div>
                </div>

                <div className="form-check w-100 text-start">
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
                </div>

                <ButtonPrimary type="submit" className="py-12 px-40 round-8">
                  註冊
                </ButtonPrimary>

                <div className="d-flex">
                  <p>已有帳號？</p>
                  <a href="#" className="link-primary" onClick={() => handleSwitch('loginModal')}>
                    立即登入
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
