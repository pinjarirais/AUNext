import Footer from "../../component/common/footer2";
import Header from "../../component/common/header2";

export default function Layout({ children }) {
  return (
    <div>
        <Header />
        {children}
        <Footer />
    </div>
  )
}