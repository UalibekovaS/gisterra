import NavigationBar from "@/components/layout/NavigationBar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <NavigationBar />
      <div className="relative">
        {/* Background Image */}
        <div
          className="h-[calc(100vh-64px)] bg-cover bg-center"
          style={{ backgroundImage: "url('main-page.png')" }}
        ></div>

        {/* Overlay Container with Welcome Text */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div
            className="text-white text-6xl font-bold bg-black bg-opacity-85 p-12 rounded-3xl shadow-lg w-[35%] h-[55%] text-center" // Added text-center class
            style={{ transform: "translateY(-50px)" }} // Moves the container up by 50px
          >
            <div className="mb-4">Welcome</div> {/* Added margin bottom */}
            <div className="mb-4">to</div>     {/* Added margin bottom */}
            <div>GISTerra</div>
            <Link 
                        href="/register" 
                        className="group flex items-center justify-center bg-500 text-white px-5 py-5 rounded-full transition-all duration-300 ease-in-out inline-flex items-center hover:bg-700 transition-colors">
                        {/* Button text */}
                        <span className="relative leading-none text-2xl transition-all duration-300 ease-in-out" style={{ top: '5px' }}>
                            Let's Start
                        </span>
                    </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
