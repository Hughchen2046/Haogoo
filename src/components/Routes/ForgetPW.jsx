import { useState, useEffect, useRef } from 'react';
import * as bootstrap from 'bootstrap';
import Logo from '../Tools/Logo';
import ButtonPrimary from '../Tools/ButtonPrimary';

export default function ForgetPW() {
  const [email, setEmail] = useState('');
  const nextModalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  const handleSwitch = (targetId) => {
    nextModalRef.current = targetId;
    const modalElement = document.getElementById('forgetPWModal');
    if (modalElement) {
      const modalInstance = modalInstanceRef.current || bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById('forgetPWModal');
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
      setEmail('');
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

    modalElement.addEventListener('hide.bs.modal', handleHide);
    modalElement.addEventListener('hidden.bs.modal', handleHidden);

    return () => {
      modalElement.removeEventListener('hide.bs.modal', handleHide);
      modalElement.removeEventListener('hidden.bs.modal', handleHidden);

      const instance = bootstrap.Modal.getInstance(modalElement);
      if (instance) {
        instance.dispose();
      }
      modalInstanceRef.current = null;
    };
  }, []);

  const handleResetPassword = (e) => {
    e.preventDefault();
    alert(`重設密碼信件已發送到: ${email}`);
    setEmail('');
  };

  return (
    <>
      <div
        className="modal fade"
        id="forgetPWModal"
        tabIndex="-1"
        aria-labelledby="forgetPWLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-bgc">
            <div className="modal-header border-0">
              <h1 className="modal-title fs-5" id="forgetPWLabel">
                重設密碼
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center font-zh-tw">
              <Logo className="header-logo mx-auto mb-24"></Logo>
              <h3 className="mb-24">忘記密碼了嗎？</h3>
              <p className="text-gray-600 mb-32">
                請輸入您的註冊信箱，我們將寄送重設密碼連結給您。
              </p>

              <div className="d-flex flex-column gap-24 align-items-center">
                <div className="w-100">
                  <h6 className="text-start mb-8">電子信箱</h6>
                  <div className="form-floating">
                    <input
                      type="email"
                      className="form-control"
                      id="forgetAccountInput"
                      placeholder="請輸入信箱"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="forgetAccountInput">email@example.com</label>
                  </div>
                </div>

                <ButtonPrimary
                  type="button"
                  className="py-12 px-40 round-8 w-100"
                  onClick={handleResetPassword}
                >
                  發送重設連結
                </ButtonPrimary>

                <div className="d-flex">
                  <a href="#" className="link-primary" onClick={() => handleSwitch('loginModal')}>
                    返回登入
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
