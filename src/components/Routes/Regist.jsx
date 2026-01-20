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
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const { Email, Password } = data;
    const submitData = {
      email: Email,
      password: Password,
    };
    try {
      const response = await axios.post(registUrl, submitData);
      console.log(response.data);
      alert('註冊成功');
      setIsRegist(true);
    } catch (error) {
      console.error(error);
      alert('註冊失敗');
      setIsRegist(false);
    }
  };
  useEffect(() => {
    if (isRegist) {
      const modalElement = document.getElementById('registModal');
      if (modalElement) {
        // 觸發關閉按鈕的點擊事件
        const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) {
          closeButton.click();
        }
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
                      className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                      id="registEmailInput"
                      placeholder="請輸入信箱"
                      {...register('Email', {
                        required: '請輸入正確 Email',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Email 格式不正確',
                        },
                      })}
                    />
                    <label htmlFor="registEmailInput">請輸入信箱</label>
                    {errors.Email && (
                      <div className="invalid-feedback text-start">{errors.Email.message}</div>
                    )}
                  </div>
                </div>

                {/* 密碼欄位 */}
                <div className="w-100">
                  <h6 className="text-start mb-8">密碼</h6>
                  <div className="form-floating">
                    <input
                      type="password"
                      className={`form-control ${errors.Password ? 'is-invalid' : ''}`}
                      id="registPasswordInput"
                      placeholder="請輸入密碼"
                      {...register('Password', {
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
                    {errors.Password && (
                      <div className="invalid-feedback text-start">{errors.Password.message}</div>
                    )}
                  </div>
                </div>

                {/* 同意條款 */}
                <div className="form-check w-100 text-start">
                  <input
                    type="checkbox"
                    className={`form-check-input ${errors.Terms ? 'is-invalid' : ''}`}
                    id="termsCheck"
                    {...register('Terms', {
                      required: '需同意服務條款',
                    })}
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    我同意服務條款與隱私政策
                  </label>
                  {errors.Terms && <div className="invalid-feedback">{errors.Terms.message}</div>}
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
