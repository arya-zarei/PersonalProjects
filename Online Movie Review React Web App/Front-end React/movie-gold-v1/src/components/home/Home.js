import Hero from "../hero/Hero";
//define home component with movie prop
const Home = ({ movies }) => {
  return <Hero movies={movies} />;
};

export default Home;
