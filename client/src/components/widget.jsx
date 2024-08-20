import React, { useEffect } from 'react';

const ElfsightWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.setAttribute('data-use-service-core', '');
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="elfsight-app-606e2550-78f5-4dfb-9af4-edc8b6e8482e" data-elfsight-app-lazy></div>
  );
};



export default ElfsightWidget;
