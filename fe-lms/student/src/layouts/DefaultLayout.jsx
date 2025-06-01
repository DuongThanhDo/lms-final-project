import { Container } from "react-bootstrap";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import ChatBotVisibility from "../components/ChatBotVisibility";

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <Container style={{minHeight: 500}}>{children}</Container>
      <ChatBotVisibility />
      <Footer />
    </div>
  );
};

export default DefaultLayout;
