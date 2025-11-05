export default function NotificationChat() {
  return (

    <div className="toast-container position-fixed top-0 end-0 p-3">

      <div id="genericToast" className="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">

        <div className="toast-header">
          <i className="bi bi-check-circle-fill me-2"></i>

          <strong className="me-auto">Thông báo</strong>

          <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>

        <div className="toast-body text-bg-success" id="genericToastBody ">
          Cập nhập thành công!
        </div>

      </div>

    </div>

  )
}