import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import AppHeader from '../appHeader/AppHeader';
import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import AppBanner from '../appBanner/AppBanner';
import ComicsList from '../comicsList/ComicsList';

import decoration from '../../resources/img/vision.png';

const App = () => {
  const [selectedChar, setChar] = useState(null);

  const onCharSelected = (id) => {
    setChar(id);
  };

  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <>
                  <ErrorBoundary>
                    <RandomChar />
                  </ErrorBoundary>
                  <div className="char__content">
                    <ErrorBoundary>
                      <CharList onCharSelected={onCharSelected} />
                    </ErrorBoundary>

                    <ErrorBoundary>
                      <CharInfo charId={selectedChar} />
                    </ErrorBoundary>
                  </div>
                  <img
                    className="bg-decoration"
                    src={decoration}
                    alt="vision"
                  />
                </>
              }
            ></Route>
            <Route
              exact
              path="/comics"
              element={
                <>
                  <AppBanner />
                  <ComicsList />
                </>
              }
            ></Route>
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
