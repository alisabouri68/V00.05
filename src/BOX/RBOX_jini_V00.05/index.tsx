import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./JiniSlider.css";

const banners = [
  {
    id: 1,
    image: "https://picsum.photos/id/1015/1200/300",
  },
  {
    id: 2,
    image: "https://picsum.photos/id/1018/1200/300",
  },
  {
    id: 3,
    image: "https://picsum.photos/id/1025/1200/300",
  },
  {
    id: 4,
    image: "https://picsum.photos/id/1035/1200/300",
  },
];

export default function JiniSlider() {
  return (
    <div className="bannerSlider">

      <button className="customPrev">
        <ArrowLeft2 size={24} />
      </button>

      <button className="customNext">
        <ArrowRight2 size={24} />
      </button>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          prevEl: ".customPrev",
          nextEl: ".customNext",
        }}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={700}
      >
        {banners.map((item) => (
          <SwiperSlide key={item.id}>
            <img src={item.image} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}