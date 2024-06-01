import "./Popup.css";

export default function Popup(props: any) {
  return (
    props.trigger && (
      <div className="popup">
        <div className="popup-inner">
          {props.children}
          <button className="close-btn" onClick={() => props.setTrigger(false)}>
            close
          </button>
        </div>
      </div>
    )
  );
}
