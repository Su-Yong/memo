import { Link } from 'wouter';

const MainPage = () => {
  return (
    <div className={'container mx-auto'}>
      MainPage

      <Link href={'/memo'}>
        toMemo
      </Link>
    </div>
  )
};

export default MainPage;
