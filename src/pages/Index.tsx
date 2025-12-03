import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Brighton Scouting App</h1>
        <p className="text-xl text-gray-400 mb-6">
          Start building your amazing project here!
        </p>
        <div className="flex flex-col space-y-4">
          <Link to="/player/1">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4">
              View Player Profile (Example)
            </Button>
          </Link>
          <Link to="/players"> {/* Link to the new player database */}
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4">
              View Player Database
            </Button>
          </Link>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;