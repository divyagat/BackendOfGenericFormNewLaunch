import LeadForm from "./components/LeadForm";
import "./index.css";

export default function App() {
  return (
    <>
      <header className="top-bar">
        <div className="logo-text">NEW LAUNCH PUNE</div>
        <div className="right">
          <span className="lang">EN</span>
          <button  className="cta">GET IN TOUCH</button>
        </div>
      </header>

      <LeadForm />
    </>
  );
}
