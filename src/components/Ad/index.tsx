import React, { useEffect } from 'react';

declare const window: any;

interface AdProps {
  slotId: string;
  width: string;
}

export const Ad: React.FC<AdProps> = (props) => {
  const { slotId, width } = props;

  useEffect(() => {
    // var ads = document.getElementsByClassName("adsbygoogle").length;
    // for (var i = 0; i < ads; i++) {
    //   try {
    //     (window.adsbygoogle = window.adsbygoogle || []).push({});
    //   } catch (e) { }
    // }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div style={{ display: 'block', width, height: '200px' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4390798454219222"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <></>
    </div>
  );
};
