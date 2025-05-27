import Footer from "@/component/common/Footer";
import Header from "@/component/common/Header";


export default function Layout({ children }) {
  return (
    <div>
        <Header />
        {children}
        <Footer />
    </div>
  )
}