import Footer from "@/component/common/footer";
import Header from "@/component/common/header";

export default function Layout({ children }) {
  return (
    <div>
        <Header />
        {children}
        <Footer />
    </div>
  )
}