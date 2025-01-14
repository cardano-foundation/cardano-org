import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

function WelcomeHero({ title, description }) {

  return (
    <div className="relative isolate overflow-hidden bg-[#0033AD] mb-10">
    
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="squares"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse">
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect fill="url(#squares)" width="100%" height="100%" strokeWidth={0} />
      </svg>
      <div
        aria-hidden="true"
        className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
        <div
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
          className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-30" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:pt-16 lg:pb-24 lg:items-center">
        <div className="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:pt-8">

          <h1 className="text-3xl font-semibold text-white sm:text-5xl sm:leading-tight">
            Making The World Work Better For All
          </h1>
          <p className="mt-8 text-lg font-regular text-[#9EACDD] md:text-xl lg:max-w-xl">
            Cardano is a blockchain platform for changemakers, innovators, and visionaries, with the tools and technologies required to create possibility for the many, as well as the few, and bring about positive global change.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a
              href="/use-cases"
              className="text-lg font-semibold text-white py-2.5 px-5 rounded-full bg-[#FF5553] hover:bg-opacity-90 hover:text-white hover:no-underline"
            >
              Where to get ada?
            </a>
            <a href="/developers" className="text-md font-semibold text-white hover:text-white hover:underline-offset-4"
            >
              Start building <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="lg:flex-none lg:max-w-none lg:relative">
            <img
              alt="Earth image"
              src="https://images.unsplash.com/photo-1517732306149-e8f829eb588a"
              // src="https://images.unsplash.com/photo-1626908013351-800ddd734b8a"
              // src="https://images.unsplash.com/photo-1451187580459-43490279c0fa"
              width={4928}
              height={3280}
              className="object-cover object-center max-h-[600px] w-full rounded-3xl bg-white/5 shadow-2xl ring-1 ring-white/10 aspect-video lg:aspect-square" 
              />
              
              <svg viewBox="0 0 375 346.51" className="hidden lg:inline absolute bottom-0 left-0 opacity-10 -mb-28 -ml-28 max-w-lg">
                <g id="layer" data-name="layer">
                    <path
                      d="M102.76,172a25.31,25.31,0,0,0,23.78,26.65c.49,0,1,0,1.46,0A25.26,25.26,0,1,0,102.76,172Z"
                      fill="#fff"
                    />
                    <path
                      d="M8.62,165.5a8.16,8.16,0,1,0,7.69,8.61A8.15,8.15,0,0,0,8.62,165.5Z"
                      fill="#fff"
                    />
                    <path
                      d="M101.16,25.43a8.16,8.16,0,1,0-11-3.62A8.18,8.18,0,0,0,101.16,25.43Z"
                      fill="#fff"
                    />
                    <path
                      d="M126.78,70.1a12.61,12.61,0,1,0-16.94-5.59A12.62,12.62,0,0,0,126.78,70.1Z"
                      fill="#fff"
                    />
                    <path
                      d="M40.58,100.82a10.39,10.39,0,1,0-3-14.38A10.39,10.39,0,0,0,40.58,100.82Z"
                      fill="#fff"
                    />
                    <path
                      d="M55.93,161a12.62,12.62,0,1,0,11.88,13.31A12.62,12.62,0,0,0,55.93,161Z"
                      fill="#fff"
                    />
                    <path
                      d="M42,245.72a10.39,10.39,0,1,0,13.95,4.6A10.37,10.37,0,0,0,42,245.72Z"
                      fill="#fff"
                    />
                    <path
                      d="M91,134.89a14.84,14.84,0,1,0-4.27-20.55A14.83,14.83,0,0,0,91,134.89Z"
                      fill="#fff"
                    />
                    <path
                      d="M246.47,69.1a12.62,12.62,0,1,0-3.63-17.47A12.61,12.61,0,0,0,246.47,69.1Z"
                      fill="#fff"
                    />
                    <path
                      d="M272.35,24.57A8.16,8.16,0,1,0,270,13.26,8.16,8.16,0,0,0,272.35,24.57Z"
                      fill="#fff"
                    />
                    <path
                      d="M248.45,147.91a25.25,25.25,0,0,0-2.87,50.42c.49,0,1,0,1.45,0a25.25,25.25,0,0,0,1.42-50.46Z"
                      fill="#fff"
                    />
                    <path
                      d="M135.08,133.14A25.12,25.12,0,0,0,157.64,147a25.25,25.25,0,0,0,22.54-36.62,25.25,25.25,0,1,0-45.1,22.73Z"
                      fill="#fff"
                    />
                    <path
                      d="M333,100.79a10.39,10.39,0,1,0-14-4.6A10.4,10.4,0,0,0,333,100.79Z"
                      fill="#fff"
                    />
                    <path
                      d="M269,108.83a14.84,14.84,0,1,0,19.94,6.58A14.86,14.86,0,0,0,269,108.83Z"
                      fill="#fff"
                    />
                    <path
                      d="M186.55,20.76a10.39,10.39,0,1,0-9.79-11A10.38,10.38,0,0,0,186.55,20.76Z"
                      fill="#fff"
                    />
                    <path
                      d="M186.43,86.13a14.84,14.84,0,1,0-14-15.66A14.84,14.84,0,0,0,186.43,86.13Z"
                      fill="#fff"
                    />
                    <path
                      d="M106,237.68a14.84,14.84,0,1,0-19.93-6.58A14.85,14.85,0,0,0,106,237.68Z"
                      fill="#fff"
                    />
                    <path
                      d="M196,107.79a25.22,25.22,0,1,0,21.14-11.41A25.28,25.28,0,0,0,196,107.79Z"
                      fill="#fff"
                    />
                    <path
                      d="M239.92,213.37a25.26,25.26,0,1,0-11.18,33.91A25.11,25.11,0,0,0,239.92,213.37Z"
                      fill="#fff"
                    />
                    <path
                      d="M284,211.62a14.84,14.84,0,1,0,4.27,20.55A14.84,14.84,0,0,0,284,211.62Z"
                      fill="#fff"
                    />
                    <path
                      d="M332.38,173.68a12.62,12.62,0,1,0-13.31,11.88A12.62,12.62,0,0,0,332.38,173.68Z"
                      fill="#fff"
                    />
                    <path
                      d="M367.3,164.71a8.16,8.16,0,1,0,7.69,8.61A8.17,8.17,0,0,0,367.3,164.71Z"
                      fill="#fff"
                    />
                    <path
                      d="M334.42,245.68a10.39,10.39,0,1,0,3,14.39A10.39,10.39,0,0,0,334.42,245.68Z"
                      fill="#fff"
                    />
                    <path
                      d="M102.65,321.94a8.16,8.16,0,1,0,2.34,11.3A8.17,8.17,0,0,0,102.65,321.94Z"
                      fill="#fff"
                    />
                    <path
                      d="M273.83,321.08a8.16,8.16,0,1,0,11,3.62A8.16,8.16,0,0,0,273.83,321.08Z"
                      fill="#fff"
                    />
                    <path
                      d="M179,238.71a25.25,25.25,0,1,0-21.14,11.41A25.1,25.1,0,0,0,179,238.71Z"
                      fill="#fff"
                    />
                    <path
                      d="M128.53,277.41a12.62,12.62,0,1,0,3.63,17.47A12.62,12.62,0,0,0,128.53,277.41Z"
                      fill="#fff"
                    />
                    <path
                      d="M187.38,325.74a10.39,10.39,0,1,0,9.78,11A10.39,10.39,0,0,0,187.38,325.74Z"
                      fill="#fff"
                    />
                    <path
                      d="M187.49,260.37a14.84,14.84,0,1,0,14,15.67A14.85,14.85,0,0,0,187.49,260.37Z"
                      fill="#fff"
                    />
                    <path
                      d="M248.21,276.4a12.62,12.62,0,1,0,17,5.59A12.62,12.62,0,0,0,248.21,276.4Z"
                      fill="#fff"
                    />
                  </g>
              </svg>
              
              
          </div>
        </div>

      </div>
      
      <div className="sectionCaret">
        <svg x="0px" y="0px" viewBox="0 0 2000 30">
          <polygon
            className="polygon-fill"
            points="1000,30 0,30 0,0 980,0 ">
          </polygon>
          <polygon
            className="polygon-fill"
            points="1000,30 2000,30 2000,0 1020,0 ">
          </polygon>
        </svg>
      </div>
      
    </div>
  );
}

export default WelcomeHero;
