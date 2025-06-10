
import '@/styles/globals.css';     
import '@/styles/css/digibima.css';  
import Header from './partial/header'
import Footer from './partial/footer'

export default function App({ Component, pageProps }) {
  return (
    <>
     <Header/>
    <Component {...pageProps} />
    <Footer/>
    </>
  );
}
