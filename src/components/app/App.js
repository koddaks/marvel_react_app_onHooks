import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

import { MainPage, ComicsPage, Page404, SingleComicPage } from '../pages';
import AppHeader from '../appHeader/AppHeader';



const App = () => {
  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />}></Route>
            <Route path="/comics" element={<ComicsPage />}></Route>
            <Route path='/comics/:comicId' element={<SingleComicPage/>}/>
            <Route path='*' element={<Page404/>}/>
            
          </Routes>
        </main>
      </div>
    </Router>
  );
};

App.propTypes = {
  onCharSelected: PropTypes.func,
};

export default App;
