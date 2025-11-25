import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
 
export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}
 
const navbar = (
<Navbar
  logo={
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img
        src="/tum_blockchain_club_logo.png"
        alt="TUM Blockchain Club"
        style={{ height: "28px" }}
      />
      <b>TUM Blockchain Club</b>
    </div>
  }
  logoLink="https://www.tum-blockchain.com/"
  projectLink="https://github.com/TUM-Blockchain-Club/Web3-developer-Docs"
/>
)
const footer = <Footer>MIT {new Date().getFullYear()} © TUM Blockchain Club.</Footer>
 
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/TUM-Blockchain-Club/Web3-developer-Docs"
          footer={footer}
          // ... Your additional layout options
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}