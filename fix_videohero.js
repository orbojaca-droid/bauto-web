const fs = require('fs');

let content = fs.readFileSync('components/media/VideoHero.tsx', 'utf8');

// Replace video element
let oldVideo = `<video
 ref={videoRef}
 src={videoUrl}
 poster={posterUrl}
 autoPlay
 muted
 loop
 playsInline
 preload="metadata"
 onLoadedData={() => setIsLoaded(true)}
 className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000"
 style={{ opacity: isLoaded ? 1 : 0.85 }}
 />`;

let newVideo = `<video
 ref={videoRef}
 src={videoUrl}
 poster={posterUrl}
 autoPlay
 muted
 loop
 playsInline
 preload="metadata"
 onLoadedData={() => setIsLoaded(true)}
 data-loaded={isLoaded}
 className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-1000 ease-in-out data-[loaded=false]:opacity-0 data-[loaded=false]:blur-sm data-[loaded=true]:opacity-100 data-[loaded=true]:blur-0"
 />`;
 
content = content.replace(oldVideo, newVideo);

// Replace button classes
content = content.replace(/transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-bauto-nube\/50/g, 'transition-all duration-150 ease-out active:scale-[0.97] focus:outline-none');

fs.writeFileSync('components/media/VideoHero.tsx', content);

