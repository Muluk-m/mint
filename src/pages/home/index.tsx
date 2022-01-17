import React from 'react';
import { render } from 'react-dom';
import LayoutHoc from '@/components/LayoutHoc';

// interface AppProps {}

const App: React.FC = () => {
  const Home = LayoutHoc(() => <>home</>);
  return <Home />;
};

// export default App;
render(<App />, document.querySelector('#root'));
