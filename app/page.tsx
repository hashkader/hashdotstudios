import Nav from '@/components/layout/Nav'
import Hero from '@/components/sections/Hero'
import SectionsClient from '@/components/sections/SectionsClient'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SectionsClient />
      </main>
      <Footer />
    </>
  )
}
