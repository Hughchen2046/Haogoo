import { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage, selectMessages } from '../../app/features/message/messageSlice';
const mySwal = withReactContent(Swal);
const typeIcon = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  question: 'question',
};

function SweetAlert() {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const showingRef = useRef(false);

  useEffect(() => {
    const msg = messages[0];
    // console.log('[SweetAlert] messages:', messages.length, 'showing:', showingRef.current, 'msg:', msg?.title);
    if (showingRef.current) return;
    if (!msg) return;

    showingRef.current = true;

    const icon = msg.icon || typeIcon[msg.type] || 'info';
    const timer = typeof msg.timer === 'number' && msg.timer > 0 ? msg.timer : undefined;

    mySwal
      .fire({
        title: msg.title || '',
        text: msg.text || '',
        icon,
        position: msg.position || 'center',
        showConfirmButton: msg.showConfirmButton ?? true,
        timer,
        timerProgressBar: msg.timerProgressBar ?? true,
        allowOutsideClick: msg.allowOutsideClick ?? true,
      })
      .finally(() => {
        dispatch(removeMessage(msg.id));
        showingRef.current = false;
      });
  }, [messages, dispatch]);

  return null;
}

export { SweetAlert };
export default SweetAlert;
