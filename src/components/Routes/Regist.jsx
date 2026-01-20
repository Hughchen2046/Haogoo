import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Logo from '../Logo';
import ButtonPrimary from '../ButtonPrimary';
import axios from 'axios';

export default function Regist() {
  const [isRegist, setIsRegist] = React.useState(false);
  const registUrl = import.meta.env.PROD
    ? 'https://haogoo-data.zeabur.app/register'
    : 'http://localhost:3000/register';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data) => {
    // 強制明確對應欄位，確保資料結構正確
    const submitData = {
      email: data.email,
      password: data.password,
      name: data.name,
      createdAt: new Date().toLocaleString(),
    };

    console.log('--- 準備送出註冊 ---');
    console.table(submitData);

    // 額外保險：如果資料遺失則中斷
    if (!submitData.email || !submitData.password) {
      alert('註冊資料未完整填寫，請確認欄位紅字提示。');
      return;
    }

    try {
      const response = await axios.post(registUrl, submitData);
      console.log('註冊伺服器回應：', response.data);

      const token = response.data.accessToken;
      alert('註冊成功');
      setIsRegist(true);
      reset(); // 清空表單

      if (token) {
        localStorage.setItem('authToken', token);
        window.dispatchEvent(new Event('authChange'));
      }

      window.dispatchEvent(
        new CustomEvent('registSuccess', {
          detail: { nickname: submitData.name },
        })
      );
    } catch (error) {
      const errorData = error.response?.data;
      console.error('註冊出錯細節：', errorData || error.message);

      let msg = '註冊失敗，請稍後再試';
      if (errorData === 'Email and password are required') {
        msg = '伺服器接收到空資料，請重新整理頁面再試一次。';
      } else if (typeof errorData === 'string') {
        msg = errorData;
      }

      alert(msg);
      setIsRegist(false);
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById('registModal');
    if (!modalElement) return;

    // 當 Modal 開啟時，重置註冊狀態，確保下次還能自動關閉
    const handleShow = () => setIsRegist(false);
    modalElement.addEventListener('show.bs.modal', handleShow);

    return () => modalElement.removeEventListener('show.bs.modal', handleShow);
  }, []);

  useEffect(() => {
    if (isRegist) {
      const modalElement = document.getElementById('registModal');
      if (modalElement) {
        const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) closeButton.click();
      }
    }
  }, [isRegist]);

  return (
    <>
      <div
        className="modal fade "
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
              >
                {/* Email 欄位 */}
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

                {/* 暱稱欄位 */}
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

                {/* 密碼欄位 */}
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

                {/* 同意條款 */}
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

                {/* 提交按鈕 */}
                <ButtonPrimary type="submit" className="py-12 px-40 round-8">
                  註冊
                </ButtonPrimary>

                {/* 登入連結 */}
                <div className="d-flex">
                  <p>已有帳號？</p>
                  <a
                    href="#"
                    className="link-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal"
                    data-bs-dismiss="modal"
                  >
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
