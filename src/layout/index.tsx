import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BiMenu } from "react-icons/bi";

import Header from "./header";

function Layout(props: any) {
  const params = useParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [JSON.stringify(params)]);

  return (
    <div className="layout">
      {!open && (
        <div
          className="px-4 d-lg-none position-relative"
          style={{ textAlign: "right", zIndex: 2 }}
        >
          <BiMenu size={45} color="#02474d" onClick={() => setOpen(true)} />
        </div>
      )}

      <Header open={open} setOpen={setOpen} />
      {props.children}
    </div>
  );
}

export default Layout;
