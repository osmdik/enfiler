import { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

type Props = {
  children?: ReactNode;
};

export default Layout;
