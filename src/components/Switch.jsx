import React, { useState, useEffect } from "react";
import { BsFillGrid3X2GapFill } from "react-icons/bs";
import { PiHandSwipeRightFill } from "react-icons/pi";

function Switch() {
  const [isSliderVisible, setIsSliderVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem("isSliderVisible");
      try {
        return JSON.parse(storedValue) ?? false;
      } catch (error) {
        return false;
      }
    }
    return false;
  });

  const toggleSlider = () => {
    setIsSliderVisible((prev) => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem("isSliderVisible", JSON.stringify(newValue));
        // Broadcast the change to other tabs/windows
        window.dispatchEvent(new StorageEvent("storage", { key: "isSliderVisible" }));
        // Toggle class names globally
        const elements = document.querySelectorAll('.contentpanel');
        elements.forEach((el) => {
          if (newValue) {
            el.classList.remove('grid-container');
            el.classList.add('horizontal-scroll', 'panels');
          } else {
            el.classList.add('grid-container');
            el.classList.remove('horizontal-scroll', 'panels');
          }
        });
      }
      return newValue;
    });
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "isSliderVisible" && typeof window !== 'undefined') {
        const storedValue = localStorage.getItem("isSliderVisible");
        setIsSliderVisible(JSON.parse(storedValue));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.contentpanel');
    elements.forEach((el) => {
      if (isSliderVisible) {
        el.classList.remove('grid-container');
        el.classList.add('slider', 'panels');
      } else {
        el.classList.add('grid-container');
        el.classList.remove('slider', 'panels');
      }
    });

    const handleWheelScroll = (event) => {
      if (isSliderVisible) {
        event.preventDefault();
        const container = event.currentTarget;
        container.scrollLeft += event.deltaY;
      }
    };

    elements.forEach((el) => {
      el.addEventListener('wheel', handleWheelScroll);
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener('wheel', handleWheelScroll);
      });
    };
  }, [isSliderVisible]);

  return (
    <div>
      <button
        aria-label="Toggle View"
        onClick={() => {
          toggleSlider();
        }}
        className="swipescroll"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "0px",
          textAlign: "center",
          width: "100%",
        }}
      >
        {isSliderVisible ? (
          <div className="themer"><BsFillGrid3X2GapFill style={{ width: '36px', height: '30px' }} /></div>
        ) : (
          <div className="themer"><PiHandSwipeRightFill style={{ width: '36px', height: '30px' }} /></div>
        )}
        <span className="themetext" style={{ fontSize: '.6rem' }}>
          {isSliderVisible ? "Scroll" : "Swipe"}
        </span>
      </button>
    </div>
  );
}

export default Switch;
