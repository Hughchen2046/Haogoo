      
      
      
      
      
      
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<MystockList />} />
        <Route path="*" element={<PopularNews />} />
      </Routes>
      <Footer />
      <Login />
      <Regist />