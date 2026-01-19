import React, { useState } from 'react';
import FBIcon from '../assets/FB Icon.png';
import IGIcon from '../assets/IG Icon.png';
import LineIcon from '../assets/LINE Icon.png';
import Rect6 from '../assets/Rectangle 6.png';
import Rect7 from '../assets/Rectangle 7.png';
import Rect8 from '../assets/Rectangle 8.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
const topics = [
  {
    category: '所有主題',
    backgroundImgUrl: Rect6,
    title: 'All Topics',
    trend1: '台股盤勢',
    trend1Link: '#',
    trend2: '國際財經',
    trend2Link: '#',
    trend3: '新聞稿',
    trend3Link: '#',
    trend4: 'ETF',
    trend4Link: '#',
  },
  {
    category: '即時熱門話題',
    backgroundImgUrl: Rect7,
    title: 'Trending Now',
    trend1: '黃金走勢',
    trend1Link: '#',
    trend2: '聯準會升息',
    trend2Link: '#',
    trend3: 'AI相關',
    trend3Link: '#',
    trend4: '能源概念股',
    trend4Link: '#',
  },
  {
    category: '觀點專區',
    backgroundImgUrl: Rect8,
    title: 'Insights',
    trend1: '名家觀點',
    trend1Link: '#',
    trend2: '好股指標',
    trend2Link: '#',
    trend3: '股事明燈',
    trend3Link: '#',
    trend4: '定期定額指標',
    trend4Link: '#',
  },
];

export default function SocialFeed() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="bg-primary round-top-48 round-top-md-80 p-12 p-md-96 font-zh-tw">
        <div className="container bg-gray-300 round-36 round-md-96 overflow-hidden">
          <div className="row">
            <div className="py-48 px-24 p-md-72 col-12 col-md-5">
              <h3 className="h2-md mb-8">社群互動</h3>
              <div className="d-flex flex-md-column gap-12 gap-md-0 mb-32 mb-md-40">
                <div className="display-2 display-1-md text-primary font-en">Social</div>
                <div className="display-2 display-1-md text-primary font-en">Feed</div>
              </div>
              <p className="en-6 fw-light text-gray-800 mb-32 mb-md-40">
                加入我們的社群，與超過 10 萬名投資人一起討論市場動向，獲取第一手投資資訊。
              </p>
              <div className="d-flex gap-24">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src={FBIcon} alt="FB link" className="icon-40 icon-hover" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <img src={IGIcon} alt="IG link" className="icon-40 icon-hover" />
                </a>
                <a href="https://www.line.com" target="_blank" rel="noopener noreferrer">
                  <img src={LineIcon} alt="Line link" className="icon-40 icon-hover" />
                </a>
              </div>
            </div>
            <div
              className="py-48 px-24 p-md-72 col-12 col-md-7 text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.5)), url("${topics[activeIndex].backgroundImgUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'background-image 0.5s ease-in-out',
              }}
            >
              <Swiper
                pagination={{ el: '.social-pagination', clickable: true }}
                modules={[Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className="socialSwiper font-zh-tw"
              >
                {topics.map((topic, index) => {
                  return (
                    <SwiperSlide className="border-0" key={index}>
                      <h3 className="mb-8">{topic.category}</h3>
                      <div className="display-2 display-1-md mb-32 mb-md-80">{topic.title}</div>
                      <div className="d-flex flex-wrap gap-12 mb-32 mb-md-80">
                        <a
                          href={topic.trend1Link}
                          className="h5 round-pill btn btn-light py-10 px-24 text-primary border-primary-200"
                        >
                          # {topic.trend1}
                        </a>
                        <a
                          href={topic.trend2Link}
                          className="h5 round-pill btn btn-light py-10 px-24 text-primary border-primary-200"
                        >
                          # {topic.trend2}
                        </a>
                        <a
                          href={topic.trend3Link}
                          className="h5 round-pill btn btn-light py-10 px-24 text-primary border-primary-200"
                        >
                          # {topic.trend3}
                        </a>
                        <a
                          href={topic.trend4Link}
                          className="h5 round-pill btn btn-light py-10 px-24 text-primary border-primary-200"
                        >
                          # {topic.trend4}
                        </a>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <div className="d-flex justify-content-between align-items-center">
                <div className="social-pagination"></div>
                <a href="#" className="text-white text-decoration-none h6 round-8 py-10 px-24">
                  查看更多
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
