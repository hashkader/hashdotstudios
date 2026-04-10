'use client'

import dynamic from 'next/dynamic'

const About = dynamic(() => import('@/components/sections/About'), { ssr: false })
const Showcase = dynamic(() => import('@/components/sections/Showcase'), { ssr: false })
const Process = dynamic(() => import('@/components/sections/Process'), { ssr: false })
const Contact = dynamic(() => import('@/components/sections/Contact'), { ssr: false })

export default function SectionsClient() {
  return (
    <>
      <About />
      <Showcase />
      <Process />
      <Contact />
    </>
  )
}
