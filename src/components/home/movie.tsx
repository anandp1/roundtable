/* eslint-disable @next/next/no-img-element */
import { Movie } from "../../modal/user.modal";

export interface MovieComponentProps {
  movie: Movie;
}

const MovieComponent: React.FC<MovieComponentProps> = ({
  movie,
}: MovieComponentProps) => {
  return (
    <div
      key={movie.imbdId}
      className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2"
    >
      <img
        className="w-full h-auto block"
        src={movie.imageUrl}
        alt={movie.title}
      />
      <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white">
        <p className="white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">
          {movie.title}
        </p>
      </div>
    </div>
  );
};
export default MovieComponent;