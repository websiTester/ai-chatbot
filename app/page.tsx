"use client";
import { useEffect, useState } from "react";
import Form from "./components/Form";
import  FormatModal  from "./components/FormatModel";
import SideBar from "./components/SideBar";
import NotificationChat from "./components/NotificationChat";


export default function Home() {

 const [isOpen, setIsOpen] = useState(false);

 const [formatDetail, setFormatDetail] = useState<any>(null)
 const [showNotification, setShowNotification] = useState(false);
 const [isCollapsed, setIsCollapsed] = useState(false);

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
      <SideBar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed}
      setShowNotification={setShowNotification}
      formatDetail={formatDetail} onOpen={() => setIsOpen(true)}></SideBar>
      <Form/>
    </div>
    <FormatModal 
          setFormatDetail = {setFormatDetail}
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} />
    {
      showNotification && <NotificationChat />
    }
    </div>
    
  );
}
