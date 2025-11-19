'use client';

import { useEffect, useState } from "react";
import { createFormat, updateFormat } from "../test/action";
type Props = {
  onOpen: () => void;
  formatDetail: any;
  setShowNotification: any;
};
export default function HeaderContentPair({setShowNotification,formatDetail, onOpen}:Props) {

    const  {pair} = formatDetail;
    const [headerContents, setHeaderContents] = useState(pair);
    const [formatName, setFormatName] = useState(formatDetail.formatName);
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        setHeaderContents(pair);
        setFormatName(formatDetail.formatName);
    }, [formatDetail]);

const addPair = () => {
    setHeaderContents((prev:any) => [
      ...prev,
      { header: "", content: "" }, // thêm cặp trống
    ]);
  };

    // 🟥 Hàm xóa cặp theo index
    const removePair = (index: number) => {
        
        setHeaderContents((prev:any) => prev.filter((_:any, i:any) => i !== index));
    };

const updatePair = (index: number, field: "header" | "content", value: string) => {
    setHeaderContents((prev:any) =>
      prev.map((pair:any, i:number) =>
        i === index ? { ...pair, [field]: value } : pair
      )
    );
  };

  const saveToDB = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const format = {
        formatName: formatName,
        pair: headerContents
        
    }
    
    if(formatDetail.formatName === formatName){
        await updateFormat(format);
    } else {
        await createFormat(format);
    }
    setIsSaving(false);
    showNotification();
  };

  function showNotification(){
        setShowNotification(true);
        const timer = setTimeout(() => {
            setShowNotification(false);
            }, 1000);
        
    }
  
    return (
        <div>
            
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="settings-title" style={{ marginBottom: 0, border: "none" }}>Format</h2>
                <button type="button" onClick={()=> onOpen()} className="btn btn-sm btn-outline-primary" id="view-all-formats-btn" data-bs-toggle="modal" data-bs-target="#formatsModal">
                    <i className="bi bi-grid-3x3-gap-fill"></i> Xem tất cả
                </button>
            </div>

            <form onSubmit={saveToDB}>
                <div className="mb-3">
                <label htmlFor="current-format-name" className="form-label">Tên Format:</label>
                <input type="text" value={formatName}
                onChange={(e) => setFormatName(e.target.value)}
                className="form-control" id="current-format-name" placeholder="Đặt tên cho format này..." />
            </div>

            <p className="form-text">Định dạng khung trả lời Markdown.</p>

            <div id="format-pairs-container">
                {
                    headerContents.map((pair:any, index:number) => (
                        <div key={index} className="format-pair">
                            <div className="inputs">
                                <input value={pair.header} 
                                onChange={(e) => updatePair(index, "header", e.target.value)}
                                type="text" className="form-control form-control-sm format-header" placeholder="Header (ví dụ: ## Tiêu đề)" />
                                <textarea value={pair.content} 
                                onChange={(e) => updatePair(index, "content", e.target.value)}
                                className="form-control form-control-sm format-content" rows={2} placeholder="Content (ví dụ: [CONTENT] hoặc nội dung cố định)"></textarea>
                            </div>
                            <button onClick={() => removePair(index)}
                             type="button" className="btn btn-sm btn-outline-danger remove-format-pair-btn">
                                <i className="bi bi-trash-fill"></i>
                            </button>
                        </div>
                    ))
                }

            </div>

            <button onClick={() => addPair()} type="button"
             className="btn btn-sm btn-outline-success mt-2" id="add-format-pair-btn">
                <i className="bi bi-plus-circle-fill"></i> Thêm cặp Header/Content
            </button>


            {/* <button type="submit" className="btn btn-success w-100 mt-3" id="save-format-btn">
                <i className="bi bi-cloud-arrow-up-fill"></i> Lưu Format
            </button> */}

            <button disabled={isSaving} type="submit" className="btn btn-success w-100 mt-3" id="save-format-btn">
                            {
                                isSaving ? (
                                    <>
                                    <i className="bi bi-arrow-repeat"></i> Đang lưu...
                                    </>
                                    
                                ):(
                                    <>
                                    <i className="bi bi-cloud-arrow-up-fill"></i> Lưu Format
                                    </>
                                    
                                )
                            }
                            
                        </button>
            </form>
            <div id="save-format-status" className="form-text mt-2"></div>
            <div id="format-limit-error" className="text-danger small mt-2"></div>

        </div>
    );
}

