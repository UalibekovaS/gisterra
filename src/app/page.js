import NavigationBar from "@/components/layout/NavigationBar";

export default function Home() {
  return (
    <div>
      <NavigationBar />
      <div className="flex justify-end mt-16 mr-20"> {/* Flex container to align to the right */}
        <div 
          className="h-[500px] w-[55%] bg-cover bg-right" // Image container
          style={{ backgroundImage: "url('gist-campus.png')" }}
        >
          {/* Optionally, add content here */}
        </div>
      </div>
    </div>
  );
}
