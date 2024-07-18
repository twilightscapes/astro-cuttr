import * as React from "react";
import { BiLeftArrow } from "react-icons/bi";
import { navigate } from "@reach/router";

const GoBack = () => {
  if (typeof window !== "undefined" && window.history.length > 1) {
    return (
      <div id="gobacker" style={{ justifyContent: 'center', color: '#ccc', border: '0px solid red' }}>
        <button 
          className="back button" 
          onClick={() => { navigate(-1) }} 
          style={{ display: 'flex', alignItems:'center', justifyContent: 'center', padding: '.5vh .5vw', background:'hsl(202, 43%, 15%)', borderRadius:'9px' }}
        >
          <span className="icon -left" style={{ paddingRight: '' }}>
            <BiLeftArrow />
          </span>
          {" "}Go Back?
        </button>
      </div>
    );
  } else {
    return null;
  }
}

export default GoBack;
