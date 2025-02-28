import HomeNav from "../Components/Navbars/HomeNav";
import shapeBg from "../Images/Shape.png";

const Homepage = () => {
  return (
    <div className="relative h-screen bg-blue-500 flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${shapeBg})` }}
      ></div>

      <header className="relative z-10">
        <HomeNav />
      </header>

      <div className="flex flex-col gap-20 flex-grow">
        <main className="flex-1 flex items-center justify-center text-center z-40">
          <div className="flex flex-col gap-6 w-2/3">
            <h1 className="text-white text-[45px] text-h1 leading-tight tracking-wide font-extrabold mb-5">
              Manage your Transactions <br />effortlessly
            </h1>
            <p className="text-white text-4xl">
              The ultimate transaction management platform to safeguard your
              finances <br />
              and ensure you never miss a payment.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Homepage;
