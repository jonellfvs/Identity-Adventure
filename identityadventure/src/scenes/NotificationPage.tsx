import "./NotificationPage.css";
import notificationImg from "../assets/images/notification_rejected.png";

type NotificationPageProps = {
  onNext: () => void;
};

export default function NotificationPage({ onNext }: NotificationPageProps) {
  return (
    <div className="notif-page">
        <div className="fade-in-overlay"/>
      {/* ── FULLSCREEN IMAGE ── */}
      {/* Replace src with your actual notification image */}
      <img
        src={notificationImg}
        alt="notification"
        className="notif-image"
      />

      {/* ── NEXT BUTTON ── */}
      <button className="notif-btn-next" onClick={onNext}>
        Next →
      </button>
    </div>
  );
}