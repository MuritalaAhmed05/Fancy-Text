"use client"
import { IoCopy } from "react-icons/io5";
import { useState } from "react";
export default function Home() {
  const [text, setText] = useState("");

  const handleInputText =(e)=>{
setText(e.target.value);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Text copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };
  return (
    <main className="">
     
<div className="bg-[#FFF8E1] flex justify-between py-[1rem]">
<div>
  {/* <Image
  src=""
  alt=""
  width={300}
  height={300}
  /> */}
</div>

<div className="flex gap-3">
  <p className="text-[#4A4A4A]"> Home</p>
  <p className="text-[#4A4A4A]">Contact</p>
  <p>Support</p>
</div>
</div>

<p className="text-center">Generate your Fancy text!!!</p>

<div className="border-[#FFE0B2] w-full border  py-[2rem] px-3"><input type="text" placeholder="Input you text..." className="w-full  border-none outline-none self-start" onKeyUp={handleInputText}/> </div>

<div className="bg-[#FFF8E1] p-3 flex items-center justify-between gap-4" >
  <p className="bg-white text-wrap w-full">{text}</p>

  <IoCopy  onClick={handleCopy} className="cursor-pointer"/>
</div>
<div className="bg-[#FFF8E1] p-3 flex items-center justify-between gap-4" >
  <p className="bg-white text-wrap w-full font-Tangerine">{text}</p>

  <IoCopy  onClick={handleCopy} className="cursor-pointer"/>
</div>
    </main>
  );
}
