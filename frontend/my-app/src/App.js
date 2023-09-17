import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './js/Main';
import MainApp from './js/MainApp';
import Pong from './js/Pong';
import Layout from './Layout';
function App() {
  return (
    <Router>
      <Layout>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/app" element={<MainApp />} />
	      <Route path="/pong" element={<Pong/>}/>
      </Routes>
      </Layout>
    </Router>
  );
}

export default App;
