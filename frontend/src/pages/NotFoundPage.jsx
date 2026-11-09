import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-gradient animate-gradient-pan select-none text-[9rem] font-black leading-none tracking-tighter md:text-[14rem]">
        404
      </p>
      <h1 className="mb-3 animate-fade-up text-2xl font-bold md:text-3xl">This page took a vacation</h1>
      <p className="mb-8 max-w-md animate-fade-up text-gray-500" style={{ animationDelay: "100ms" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn-dark btn-shine group animate-fade-up" style={{ animationDelay: "200ms" }}>
        <HiArrowLeft className="transition-transform group-hover:-translate-x-1" /> Back to home
      </Link>
    </div>
  );
};

export default NotFoundPage;
