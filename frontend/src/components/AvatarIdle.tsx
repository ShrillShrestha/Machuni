import React, { useEffect, useRef, useState } from "react";

const avatarAnimationQueue: string[] = [
  "straight-smile.png",
  "straight-smile.png",
  "look-right-smile.png",
  "look-right-speak.png",
  "look-right-speak.png",
  "look-right-smile.png",
  "look-left-smile.png",
  "look-left-speak.png",
  "look-left-speak.png",
  "look-left-smile.png",
  "eyes-closed-speak.png",
  "eyes-closed-speak.png",
];

const getFrameDelay = (imageName: string) => {
  if (imageName.includes("eyes-closed")) return 200;
  return Math.floor(Math.random() * 1500) + 800;
};

const AvatarIdle = () => {
  const [frame, setFrame] = useState(0);
  const frameRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const advanceFrame = () => {
      frameRef.current = (frameRef.current + 1) % avatarAnimationQueue.length;
      setFrame(frameRef.current);

      const nextImage = avatarAnimationQueue[frameRef.current];
      const delay = getFrameDelay(nextImage);

      timeoutRef.current = setTimeout(advanceFrame, delay);
    };

    timeoutRef.current = setTimeout(
      advanceFrame,
      getFrameDelay(avatarAnimationQueue[0])
    );

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="rounded-full p-[3px] overflow-hidden bg-primary shrink-0 relative border-4 border-blue-600">
      <div className="size-24 sm:w-[130px] sm:h-[130px]"></div>
      {avatarAnimationQueue.map((img, index) => (
        <img
          key={index}
          hidden={index !== frame}
          src={`/images/avatar/${img}`}
          alt="profile"
          width={130}
          height={130}
          className="bg-[#f4f4f5] rounded-full object-cover w-24 h-24 sm:w-[130px] sm:h-[130px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      ))}
    </div>
  );
};

export default AvatarIdle;
