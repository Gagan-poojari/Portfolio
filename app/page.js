import Image from "next/image";
import NavBar from "./components/NavBar";
import Part1 from "./components/Part1";
import Part2 from "./components/Part2";
import Part3 from "./components/Part3";

export default function Home() {
  return (
    <div>
      <NavBar />
      <Part1 />
      <Part2 />
      <Part3 />
    </div>
  );
}
