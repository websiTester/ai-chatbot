'use client';
import { useEffect, useState } from "react";
import { fetchFormats } from "../test/action";
type Props = {
    isOpen: boolean
    onClose: () => void;
};
export default function FormatModal({ isOpen, onClose, setFormatDetail}: any) {

    const [formats, setFormats] = useState<any[]>([]);
    const [defaultFormat, setDefaultFormat] = useState<any>(null);


    useEffect(() => {
        if (isOpen) {
            const loadFormats = async () => {
                const res = await fetch("/api/format");
                var data = await res.json();
                
                
                setDefaultFormat(data.find((format: any) => format.formatName==="Default") || null);
                data = data.filter((format: any) => format.formatName!=="Default");
                setFormats(data);

            };
            loadFormats();
        }
    }, [isOpen])

    async function deleteFormat(formatId: string) {
        
        await fetch(`/api/format?id=${formatId}`, {
                    method: "DELETE",
                    });
        const updatedFormats = formats.filter(format => format._id !== formatId);
        setFormats(updatedFormats);
        console.log("Deleted successful format with id:", formatId);
    }
    if(defaultFormat===null){
        return (
            <div></div>
        );
    }

    return (
        <div className={`modal fade ${isOpen ? "show" : ""}`} style={{ background: "#00000054",display: isOpen ? "block" : "none" }} id="formatsModal" tabIndex={-1} aria-labelledby="formatsModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-scrollable" >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="formatsModalLabel">Chọn một Format</h5>
                        <button onClick={() => onClose()} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    {
                        defaultFormat && (
                            <div className="modal-body">
                        <p>Nhấn vào một format để tải nó vào trình chỉnh sửa.</p>
                        <ul className="list-group" id="modal-format-list">
                            <li key={defaultFormat._id} 
                                    onClick={() => setFormatDetail(defaultFormat)}
                            className="list-group-item list-group-item-action list-group-item-info d-flex justify-content-between align-items-center"><span><i className="bi bi-star-fill"></i> Format Mặc Định (Hệ thống)</span></li>
                            {
                                formats.map((format:any) => (
                                    <li key={format._id} 
                                    onClick={() => setFormatDetail(format)}
                                    className="list-group-item list-group-item-action list-group-item-info d-flex justify-content-between align-items-center"><span> {format.formatName}</span>
                                    <button onClick={(e) => deleteFormat(format._id)} className="btn btn-sm btn-outline-danger delete-preset-btn" title="Xóa preset &quot;Format Mặc Định (Hệ thống)&quot;"><i className="bi bi-trash-fill"></i></button>
                                    
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                        )
                    }
                </div>
            </div>
        </div>

    );
}


