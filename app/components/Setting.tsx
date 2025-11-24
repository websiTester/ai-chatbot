'use client'

import { useEffect, useState } from "react"

export default function Setting({setIsSettingOpen, isSettingOpen}: any){

    const [tab, setTab] = useState(1);
    const [agents, setAgents] = useState<any[]>([])
    const [selectedInstruction, setSelectedInstruction] = useState<any>();
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        const getAllAgents = async () => {
            var res = await fetch("/api/instruction");
            var data = await res.json();
            var agentList = data.map((item:any) => ({
                id: item.id,
                name: item.name,
                instruction: item.instruction
            }));
            setSelectedInstruction(agentList[0])
            setAgents(agentList);
        }
        getAllAgents();
    },[])

    function handleOnNameChange(target: HTMLSelectElement){
        var agentName = target.value;
        var agent = agents.find(agent => (agent.name==agentName));
        setSelectedInstruction(agent);
    }

    function handleOnInstructionChange(target: HTMLTextAreaElement){
        var instruction = target.value;
        var agent = {...selectedInstruction, instruction};
        setSelectedInstruction(agent);

        

    }

    async function saveAgentInstruction(){
        setIsSaving(true);
        await fetch("/api/instruction", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedInstruction),
        });
        setIsSaving(false);

 
        const newAgents = agents.map((item) => {
            if(item.name===selectedInstruction.name)  {
                return selectedInstruction
            } 
            return item;
        });

        
        setAgents(newAgents);
    }

    return (
        <div className={`modal fade ${isSettingOpen?"show":""}`} style={{display: `${isSettingOpen?"block":"none"}`,background: "#00000052"}}
        id="settingsModal" tabIndex={1} aria-labelledby="settingsModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="settingsModalLabel"><i className="bi bi-gear-fill"></i> Cài đặt Hệ thống</h5>
                        <button onClick={() => setIsSettingOpen(false)} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        
                        <ul className="nav nav-tabs mb-3" id="settingsTabs" role="tablist">
                            <li onClick={() => setTab(1)} className="nav-item" role="presentation">
                                <button className={`nav-link ${tab==1?"active":""}`} id="file-tab" data-bs-toggle="tab" data-bs-target="#nav-file" type="button" role="tab" aria-controls="nav-file">
                                    <i className="bi bi-file-earmark-arrow-up"></i> File
                                </button>
                            </li>
                            <li onClick={() => setTab(2)} className="nav-item" role="presentation">
                                <button className={`nav-link ${tab==2?"active":""}`} id="prompt-tab" data-bs-toggle="tab" data-bs-target="#nav-prompt" type="button" role="tab" aria-controls="nav-prompt">
                                    <i className="bi bi-chat-quote"></i> Prompts
                                </button>
                            </li>
                            <li onClick={() => setTab(3)} className="nav-item" role="presentation">
                                <button className={`nav-link ${tab==3?"active":""}`} id="instruction-tab" data-bs-toggle="tab" data-bs-target="#nav-instruction" type="button" role="tab" aria-controls="nav-instruction">
                                    <i className="bi bi-database"></i> Instructions
                                </button>
                            </li>
                        </ul>

                        <div className="tab-content" id="nav-tabContent">
                            
                            <div className={`tab-pane fade ${tab==1?"show active":""}`} id="nav-file" role="tabpanel" aria-labelledby="file-tab">
                                <p className="text-muted">Tải lên tài liệu để Agent sử dụng làm kiến thức (RAG).</p>
                                
                                <div className="upload-area mb-3" id="upload-area">
                                    <i className="bi bi-cloud-upload display-4 text-secondary"></i>
                                    <p className="mb-0 mt-2">Kéo thả file vào đây hoặc click để chọn</p>
                                    <p className="small text-muted">(Hỗ trợ PDF, DOCX, TXT)</p>
                                    <input type="file" id="file-upload-input" multiple style={{display: "none"}}/>
                                </div>
                                
                                <h6 className="fw-semibold mt-4 mb-3">File đã tải lên:</h6>
                                <div id="uploaded-file-list">
                                    <div className="text-center text-muted py-3" id="empty-file-msg">Chưa có file nào.</div>
                                </div>
                            </div>

                            <div className={`tab-pane fade ${tab==2?"show active":""}`} id="nav-prompt" role="tabpanel" aria-labelledby="prompt-tab">
                                 <div className="mb-3">
                                <label className="form-label fw-semibold">Chọn Agent:</label>
                                {
                                    agents.length>0 ? (
                                        <select onChange={(e) => handleOnNameChange(e.target)}
                                         className="form-select" id="instruction-agent-select">
                                            {   
                                                agents.map((agent:any) => (
                                                    <option  key={agent.id} value={agent.name}>{agent.name}</option>
                                                ))
                                            }
                                        </select>
                                     ) : (
                                        <div className="text-muted">
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Đang tải danh sách agent...
                                        </div>
                                     )
                                }
                            </div>

                                <p className="text-muted">Chỉnh sửa cấu trúc Prompt gửi cho Agent.</p>
                                
                                <textarea id="prompt-template-editor" className="form-control mb-3" rows={15}></textarea>
                                
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-primary" id="save-prompt-btn">
                                        <i className="bi bi-save"></i> Lưu Template
                                    </button>
                                </div>
                            </div>

                            <div className={`tab-pane fade ${tab==3?"show active":""}`} id="nav-instruction" role="tabpanel" aria-labelledby="instruction-tab">
                                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                <p className="text-muted mb-0">Chỉnh sửa Instruction của Agent trong Database.</p>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-primary" id="refresh-db-btn" style={{whiteSpace: "nowrap"}}>
                                        <i className="bi bi-arrow-clockwise"></i> Refresh
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Chọn Agent:</label>
                                {
                                    agents.length>0 ? (
                                        <select onChange={(e) => handleOnNameChange(e.target)}
                                         className="form-select" id="instruction-agent-select">
                                            {   
                                                agents.map((agent:any) => (
                                                    <option  key={agent.id} value={agent.name}>{agent.name}</option>
                                                ))
                                            }
                                        </select>
                                     ) : (
                                        <div className="text-muted">
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Đang tải danh sách agent...
                                        </div>
                                     )
                                }
                                
                            </div>

                            <div id="single-instruction-container">
                                {
                                    selectedInstruction ? (
                                        <textarea onChange={(e) => handleOnInstructionChange(e.target)} value={selectedInstruction.instruction} id="db-instruction-editor" className="form-control mb-3" rows={15}>
                                       
                                        </textarea>
                                    ) : (
                                        <div className="text-muted">
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Đang tải Instruction Agent...
                                        </div>
                                    )
                                }
                                
                                <div className="d-flex justify-content-end">
                                    
                            <button onClick={() => saveAgentInstruction()} disabled={isSaving} type="submit" className="btn btn-primary" id="save-db-instruction-btn">
                                {
                                    isSaving ? (
                                        <>
                                        <i className="bi bi-arrow-repeat"></i> Đang lưu...
                                        </>
                                        
                                    ):(
                                        <>
                                        <i className="bi bi-save"></i> Lưu Instructions
                                        </>
                                        
                                    )
                                }
                                
                            </button>
                                </div>
                            </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}