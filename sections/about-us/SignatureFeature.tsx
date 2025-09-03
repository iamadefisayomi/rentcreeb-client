"use client"

import {Icon} from '@iconify/react'

export default function SignatureFeature () {

    return (
        <div className="w-full mx-auto max-w-8xl flex flex-col gap-5 md:gap-8 px-4 py-8 md:min-h-screen md:items-center md:justify-center">
            <div className="w-full flex flex-col items-center justify-center gap-2 ">
                <h3 className="text-xs font-medium uppercase text-primary text-center">signature features</h3>
                <h1 className="text-2xl capitalize font-bold text-slate-900  text-center">Masterful Design: A Showcase <br /> of Quality and Craftsmanship</h1>
            </div>

            <div className="flex flex-col gap-5 w-full md:grid md:grid-cols-2">
                {_signatureData.map((props, index) => <Signatures key={index} props={props} />)}
            </div>
        </div>
    )
}


const Signatures = ({props}: {props: {title: string, details: string, icon: any}}) => {
    const {details, icon, title} = props
    return (
        <div className="w-full rounded-md duration-200 cursor-pointer md:rounded-2xl p-3 md:p-8 bg-white border group flex items-center group hover:bg-primary/90 gap-2">
            <span className="w-fit p-3 border group-hover:bg-white border-blue-300 rounded-md md:rounded-2xl bg-theme-main">
                {icon}
            </span>

            <span className="flex flex-col items-start justify-between gap-2">
                <h1 className="text-xs capitalize font-semibold group-hover:text-white text-slate-900">{title}</h1>
                <h1 className="text-[11px] capitalize text-muted-foreground group-hover:text-white">{details}</h1>
            </span>
        </div>
    )
}

const _signatureData = [
    {
      title: "Easy to Rent",
      icon: <Icon icon="ic:baseline-house" className="w-8 h-8 md:w-12 md:h-12 text-primary" />,
      details:
        "Enjoy a seamless renting experience with minimal paperwork and quick approvals. Our hassle-free process ensures you find your dream home without unnecessary delays or complications.",
    },
    {
      title: "Carefully Crafted",
      icon: <Icon icon="hugeicons:web-design-01" className="w-8 h-8 md:w-12 md:h-12 text-primary" />,
      details:
        "Designed with attention to detail, our spaces blend aesthetics with functionality. Every corner is thoughtfully planned to provide a harmonious and comfortable living environment.",
    },
    {
      title: "In-Built Wardrobe",
      icon: <Icon icon="hugeicons:wardrobe-01" className="w-8 h-8 md:w-12 md:h-12 text-primary" />,
      details:
        "Keep your living space organized with spacious, modern wardrobes built into every room. Designed for convenience, they offer ample storage while complementing the home’s interiors.",
    },
    {
      title: "Lavish Greenery",
      icon: <Icon icon="hugeicons:flower-pot" className="w-8 h-8 md:w-12 md:h-12 text-primary" />,
      details:
        "Surround yourself with lush green landscapes, beautifully maintained gardens, and serene outdoor spaces. Our eco-friendly approach ensures a refreshing and peaceful atmosphere all year round.",
    },
    {
      title: "Spacious Outdoors",
      icon: <Icon icon="ic:round-camera-outdoor" className="w-8 h-8 md:w-12 md:h-12 text-primary" />,
      details:
        "Experience the joy of open, airy outdoor spaces perfect for relaxation, social gatherings, or recreational activities. Whether it's a morning coffee or an evening stroll, enjoy the fresh air anytime.",
    },
    {
      title: "Planned Construction",
      icon: <Icon icon="mdi:construction-outline" className="w-8 h-8 md:w-12 md:h-12 text-primary" />,
      details:
        "Built with high-quality materials and a focus on sustainability, our homes are designed for long-term durability and safety. Enjoy a structurally sound and well-planned living space that stands the test of time.",
    },
  ];
  