import React, { useEffect, useRef, useState } from 'react';
export default function TubesCursor() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const {
          default: createTubes
        } = await import('/vendor/tubes1.min.js');
        if (cancelled || !canvasRef.current) return;
        appRef.current = createTubes(canvasRef.current, {
          tubes: {
            colors: ['#5e72e4', '#8965e0', '#f5365c'],
            lights: {
              intensity: 200,
              colors: ['#21d4fd', '#b721ff', '#f4d03f', '#11cdef']
            }
          }
        });
      } catch (cause) {
        console.error('Tubes Cursor preview failed to load', cause);
        if (!cancelled) setError(true);
      }
    }, 100);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      appRef.current?.dispose?.();
      appRef.current = null;
    };
  }, []);
  function changeColors() {
    if (!appRef.current) return;
    const randomColors = count => Array.from({
      length: count
    }, () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
    appRef.current.tubes.setColors(randomColors(3));
    appRef.current.tubes.setLightsColors(randomColors(4));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tubes-demo",
    onClick: changeColors
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    className: "tubes-canvas",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tubes-demo-copy"
  }, /*#__PURE__*/React.createElement("h1", null, "TUBES"), /*#__PURE__*/React.createElement("h2", null, "CURSOR"), /*#__PURE__*/React.createElement("p", null, "Click to change colors")), error && /*#__PURE__*/React.createElement("p", {
    className: "tubes-error",
    role: "status"
  }, "3D preview could not start on this device."));
}