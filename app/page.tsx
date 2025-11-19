"use client";
import { useEffect, useState } from "react";
import Form from "./components/Form";
import  FormatModal  from "./components/FormatModel";
import SideBar from "./components/SideBar";
import NotificationChat from "./components/NotificationChat";
import InstructionModal from "./components/InstructionModal";


export default function Home() {

  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
 const [isOpen, setIsOpen] = useState(false);

 const [formatDetail, setFormatDetail] = useState<any>(null)
 const [showNotification, setShowNotification] = useState(false);
 const [isCollapsed, setIsCollapsed] = useState(false);
 const [isOriginAgent, setIsOriginAgent] = useState(true);
 useEffect(() => {
   const initFormat = async () => {
      const res = await fetch(`/api/format/name?name=${encodeURIComponent("Default")}`);
      const data = await res.json();
      console.log("====Dữ liệu nhận được:", data);
      setFormatDetail(data);
   };
   initFormat();
 },[]);

  return (
    <div>
      <div className={`main-layout ${isCollapsed?"sidebar-collapsed":""}`}>
      <SideBar isOriginAgent={isOriginAgent} setIsOriginAgent={setIsOriginAgent}
      setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed}
      setShowNotification={setShowNotification}
      setIsReadmeOpen={setIsReadmeOpen}
      formatDetail={formatDetail} onOpen={() => setIsOpen(true)}></SideBar>
      <Form isOriginAgent={isOriginAgent}/>
    </div>
    <FormatModal 
          setFormatDetail = {setFormatDetail}
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} />

    <InstructionModal 
    isReadmeOpen={isReadmeOpen}
    setIsReadmeOpen={setIsReadmeOpen}
    />
    {
      showNotification && <NotificationChat />
    }
    </div>
    
  );
}
