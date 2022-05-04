import React from 'react';
import Container from 'react-bootstrap/Container';

import './App.css';

// import Editor from './components/h5p'

import ContentList from './components/h5p/h5p_content_list/ContentListComponent';

import { useContent } from './hooks/useContent'

const App = () => {

  const contentService = useContent('/h5p');
  
  return (
    <div className="App">
      {/* <Editor/> */}
      <Container>
        <h1>H5P SKYCLICK </h1>

        {
          contentService?<ContentList
                            contentService={contentService}
                        ></ContentList>
          : <h1>Loading...</h1>
        }

      </Container>

    </div>
  );
}

export default App;
