import React from "react";
import { Layout } from 'antd';
import "./App.css";
import Navbar from "../navbar/Navbar";
import { appRouter } from "../../utils/router/AppRouter";
import { BrowserRouter as Router } from "react-router-dom";

const { Content, Footer } = Layout;

class App extends React.Component {
  render() {
    return (
      <Router forceRefresh={true}>
        <Layout>
          <Navbar />
          <Content style={{ padding: "25px 50px" }}>
            <div className="site-layout-content" style={{ height: "100%" }}>
              {appRouter()}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            QuestShare ©2020 Created by Junho Kim
          </Footer>
        </Layout>
      </Router>
    );
  }
}

export default App;
