'use client';

import { useEffect, useState } from "react";
import HeaderContentPair from "./HeaderContentPair";
import { updateAgentsInstruction } from "../test/action";
import { set } from "mongoose";

type Props = {
    onOpen: () => void;
    formatDetail: any;
    setShowNotification: any,
    setIsCollapsed: any,
    isCollapsed: boolean
};


export default function SideBar({setIsCollapsed,isCollapsed, setShowNotification, onOpen, formatDetail }: Props) {

    const [agent1Mode, setAgent1Mode] = useState("default");
    const [agent2Mode, setAgent2Mode] = useState("default");
    const [agent3Mode, setAgent3Mode] = useState("default");
    const [isSaving, setIsSaving] = useState(false);
    const [instructions, setInstruction] = useState<string[]>([]);

    const [functionAgents, setFunctionAgents] = useState<any[][]>([]);

    

    useEffect(() => {

        const getAllAgents = async () => {
            const res = await fetch("/api/instruction");
            const data = await res.json();
            const instruction = data.map((item: any) => item.instruction);
            setInstruction(instruction);
            console.log("======DATA========" + instruction);
        }
        getAllAgents()
    }, []);

    useEffect(() => {

        setFunctionAgents([[], [], []]);
    }, [formatDetail]);


    if (!formatDetail || !formatDetail.pair || instructions.length == 0) {
        return <div>Đang tải...</div>;
    }

    var { pair } = formatDetail;
    pair = pair.map((item: any) => ({
        ...item,
        checked: false
    }));
    //setPairList(pair);

    function showNotification(){
        setShowNotification(true);
        const timer = setTimeout(() => {
            setShowNotification(false);
            }, 1000);
    }

    function handleOnChange(index: number, value: string) {
        const updated = [...instructions];
        updated[index] = value;
        setInstruction(updated);
    }

    function onRadioChange(agentIndex: number, mode: string) {
        functionAgents[agentIndex] = [];
        setFunctionAgents(functionAgents);
        if(agentIndex == 0){
            setAgent1Mode(mode);
        } else if(agentIndex == 1){
            setAgent2Mode(mode);
        } else if(agentIndex == 2){
            setAgent3Mode(mode);
        }
    }

    function handleOnCheckChange(id: number, index: number, target: HTMLInputElement) {
        const value = target.value;
        const checked = target.checked;

        console.log("Checked header index: " + index + " value: " + value + " checked: " + checked);
        if (checked) {
            functionAgents[id] = [...(functionAgents[id] || []), value];
            setFunctionAgents(functionAgents);
            console.log("Function Agents after check: ", functionAgents);
        } else {
            functionAgents[id] = (functionAgents[id] || []).filter((item: string) => item !== value);
            setFunctionAgents(functionAgents);
            console.log("Function Agents after uncheck: ", functionAgents);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);
        await updateAgentsInstruction(functionAgents, instructions);
        setIsSaving(false);
        window.location.reload();
    }

    async function onReset() {
        await fetch("/api/reset", {
            method: "PUT"
        });
        window.location.reload();
    }
    return (
        <aside className="settings-panel">

            <button onClick={() => setIsCollapsed(!isCollapsed)} className="btn btn-sm btn-outline-secondary" id="toggle-sidebar-btn" title="Thu/mở sidebar">
                <i className="bi bi-list"></i>
            </button>

            <div className="settings-panel-content">

                <div className="mb-4">
                    <h2 className="settings-title">Instructions</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="agent-block">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="fw-semibold mb-0">Agent 1</h6>
                            <button onClick={() => onReset()} className="btn btn-sm btn-outline-warning" id="reset-agent-1-btn" title="Reset Agent 1">
                                <i className="bi bi-arrow-counterclockwise"></i> Reset
                            </button>
                        </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input instruction-toggle" type="radio" name="agent1-toggle" id="agent1-default" value="default" data-agent="1"
                                    checked={agent1Mode == "default"}
                                    onChange={() => onRadioChange(0, "default")} />
                                <label className="form-check-label" htmlFor="agent1-default">Dùng mặc định</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input instruction-toggle" type="radio" name="agent1-toggle" id="agent1-custom" value="custom" data-agent="1"
                                    checked={agent1Mode == "custom"}
                                    onChange={() => onRadioChange(0, "custom")} />
                                <label className="form-check-label" htmlFor="agent1-custom">Dùng tùy chỉnh</label>
                            </div>
                            {
                                agent1Mode == "custom" && (
                                    <textarea onChange={(e) => handleOnChange(0, e.target.value)}
                                        value={instructions[0]} id="instruction-agent-1" className="form-control instruction-textarea" rows={5} placeholder="Nhập instruction cho Agent 1..."></textarea>

                                )
                            }

                            {
                                agent1Mode == "default" && (
                                    <div id="agent-1-format-toggles" className="format-toggles-container small mt-2">

                                        {

                                            pair && pair.map((item: any, index: number) => {
                                                return (<div key={index} className="form-check form-check-inline">
                                                    <input onChange={(e) => handleOnCheckChange(0, index, e.target)}
                                                        value={item.header+": "+item.content} className="form-check-input" type="checkbox" id={`agent-1-header-${index}`} />
                                                    <label className="form-check-label" htmlFor={`agent-1-header-${index}`}>{item.header}</label>
                                                </div>)
                                            })
                                        }

                                    </div>
                                )
                            }



                        </div>

                        <div className="agent-block">
                            <h6 className="fw-semibold">Agent 2</h6>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input instruction-toggle" type="radio" name="agent2-toggle" id="agent2-default" value="default" data-agent="2"
                                    checked={agent2Mode == "default"}
                                    onChange={() => onRadioChange(1, "default")} />
                                <label className="form-check-label" htmlFor="agent2-default">Dùng mặc định</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input instruction-toggle" type="radio" name="agent2-toggle" id="agent2-custom" value="custom" data-agent="2"
                                    checked={agent2Mode == "custom"}
                                    onChange={() => onRadioChange(1, "custom")} />
                                <label className="form-check-label" htmlFor="agent2-custom">Dùng tùy chỉnh</label>
                            </div>

                            {
                                agent2Mode == "custom" && (
                                    <textarea onChange={(e) => handleOnChange(1, e.target.value)}
                                        value={instructions[1]} id="instruction-agent-2" className="form-control instruction-textarea" rows={5} placeholder="Nhập instruction cho Agent 2..."></textarea>
                                )
                            }

                            {
                                agent2Mode == "default" && (
                                    <div id="agent-2-format-toggles" className="format-toggles-container small mt-2">
                                        {

                                            pair && pair.map((item: any, index: number) => {
                                                return (<div key={index} className="form-check form-check-inline">
                                                    <input onChange={(e) => handleOnCheckChange(1, index, e.target)}
                                                        value={item.header+": "+item.content} className="form-check-input" type="checkbox" id={`agent-2-header-${index}`} />
                                                    <label className="form-check-label" htmlFor={`agent-2-header-${index}`}>{item.header}</label>
                                                </div>)
                                            })
                                        }

                                    </div>
                                )}

                        </div>

                        <div className="agent-block">
                            <h6 className="fw-semibold">Agent 3</h6>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input instruction-toggle" type="radio" name="agent3-toggle" id="agent3-default" value="default" data-agent="3"
                                    checked={agent3Mode == "default"}
                                    onChange={() => onRadioChange(2, "default")} />
                                <label className="form-check-label" htmlFor="agent3-default">Dùng mặc định</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input instruction-toggle" type="radio" name="agent3-toggle" id="agent3-custom" value="custom" data-agent="3"
                                    checked={agent3Mode == "custom"}
                                    onChange={() => onRadioChange(2, "custom")} />
                                <label className="form-check-label" htmlFor="agent3-custom">Dùng tùy chỉnh</label>
                            </div>
                            {
                                agent3Mode == "custom" && (
                                    <textarea onChange={(e) => handleOnChange(2, e.target.value)}
                                        value={instructions[2]} id="instruction-agent-3" className="form-control instruction-textarea" rows={5} placeholder="Nhập instruction cho Agent 3..."></textarea>

                                )
                            }

                            {
                                agent3Mode == "default" && (
                                    <div id="agent-3-format-toggles" className="format-toggles-container small mt-2">
                                        {

                                            pair && pair.map((item: any, index: number) => {
                                                return (<div key={index} className="form-check form-check-inline">
                                                    <input onChange={(e) => handleOnCheckChange(2, index, e.target)} 
                                                    value={item.header+": "+item.content} className="form-check-input" type="checkbox" id={`agent-3-header-${index}`} />
                                                    <label className="form-check-label" htmlFor={`agent-3-header-${index}`}>{item.header}</label>
                                                </div>)
                                            })
                                        }

                                    </div>
                                )
                            }

                        </div>


                        <button disabled={isSaving} type="submit" className="btn btn-success w-100 mt-2" id="save-instructions-btn">
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
                        <div id="save-instructions-status" className="form-text mt-2"></div>
                    </form>


                </div>

                <HeaderContentPair 
                    setShowNotification={setShowNotification}   
                    formatDetail={formatDetail}
                    onOpen={() => onOpen()} />

            </div>

        </aside>
    )
}