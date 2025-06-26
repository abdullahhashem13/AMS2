import "../style/Searchsection.css";
import { useState, useEffect } from "react";

export default function Searchsection(props) {
  const [searchTerm, setSearchTerm] = useState("");

  // استخدام debounce لتأخير إرسال طلب البحث
  useEffect(() => {
    const timer = setTimeout(() => {
      props.onSearch(searchTerm);
    }, 300); // تأخير 300 مللي ثانية

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, props]);

  return (
    <form className="displayflexjust formsearch">
      <input
        className="inputsearch"
        type="text"
        maxLength={props.maxLength}
        placeholder={props.placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      ></input>
    </form>
  );
}
