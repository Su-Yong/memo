import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div className={'container mx-auto'}>
      MainPage

      <Link to={'/memo'}>
        toMemo
      </Link>
    </div>
  )
};

export default MainPage;
