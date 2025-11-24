"use client";
import { useEffect, useState } from "react";
import Form from "./components/Form";
import  FormatModal  from "./components/FormatModel";
import SideBar from "./components/SideBar";
import NotificationChat from "./components/NotificationChat";
import InstructionModal from "./components/InstructionModal";
import Setting from "./components/Setting";


export default function Home() {

  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
 const [isOpen, setIsOpen] = useState(false);

 const [formatDetail, setFormatDetail] = useState<any>(null)
 const [showNotification, setShowNotification] = useState(false);
 const [isCollapsed, setIsCollapsed] = useState(false);
 const [isOriginAgent, setIsOriginAgent] = useState(true);
const [isSettingOpen, setIsSettingOpen] = useState(false);
 const [selectedAgent, setSelectedAgent] = useState({
        icon: "bi bi-stars me-2",
        title: "Origin Agent"
    });

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
      <SideBar selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent}
      setIsSettingOpen={setIsSettingOpen}
       isOriginAgent={isOriginAgent} setIsOriginAgent={setIsOriginAgent}
      setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed}
      setShowNotification={setShowNotification}
      setIsReadmeOpen={setIsReadmeOpen}
      formatDetail={formatDetail} onOpen={() => setIsOpen(true)}></SideBar>
      <Form selectedAgent={selectedAgent}/>
    </div>
    <FormatModal 
          setFormatDetail = {setFormatDetail}
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} />

    <InstructionModal 
    isReadmeOpen={isReadmeOpen}
    setIsReadmeOpen={setIsReadmeOpen}
    />
    <Setting setIsSettingOpen={setIsSettingOpen} isSettingOpen={isSettingOpen}/>

    {
      showNotification && <NotificationChat />
    }
    </div>
    
  );
}
