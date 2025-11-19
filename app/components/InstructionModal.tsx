'use client'

export default function InstructionModal({isReadmeOpen, setIsReadmeOpen}: any){

    return (
    <div className={`modal fade ${isReadmeOpen ? "show" : ""}`} style={{ background: "#00000054", display: isReadmeOpen ? "block" : "none" }} id="readmeModal" tabIndex={-1} aria-labelledby="readmeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="readmeModalLabel"><i className="bi bi-info-circle-fill"></i> Hướng dẫn Cài đặt & Sử dụng</h5>
                    <button type="button" onClick={() => setIsReadmeOpen(false)} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <p>AI agent này chuyên phân tích các yêu cầu chức năng của 1 website e-commerce. Agent này có thể tương tác với ứng dụng Obsidian để sao lưu, trích xuất các đoạn chat mà người dùng muốn.</p>
                    
                    <h4>Yêu cầu khi chạy project</h4>
                    <ul>
                        <li>Mở ứng dụng Obsidian trên máy của bạn trước khi chạy project để project có thể kết nối được với Obsidian.</li> <br/>
                        <li>Ứng dụng Obsidian đã Enable <strong>Local Rest API</strong>.</li> <br/>
                        <li>Tạo 1 file <strong>.env.prod</strong> trong máy của bạn chứa các biến môi trường sau:  <br/>
                            <strong>GOOGLE_GENERATIVE_AI_API_KEY</strong>=your_google_api_key <br/>

                            <strong>MONGODB_DATABASE</strong>=your_mongoDB_name <br/>
                            <strong>MONGODB_URI</strong>=your_mongoDB_uri <br/>
                            <strong>OBSIDIAN_API_KEY</strong>=your_obsidian_API_key <br/>
                            <strong>OBSIDIAN_BASE_URL</strong>=your_obsidian_base_uri <br/>
                        </li>
                    </ul>

                    <h4>Cách chạy dự án</h4>
                    <ol>
                        <li>
                            <strong>Dùng câu lệnh sau trong terminal để chạy Docker Image:</strong> <br/>
                                docker run -d -p 3000:3000 --env-file absolute_path_to_your_.env.prod --name container_name image_name <br/>

                                VD: <br/>
                                docker run -d -p 3000:3000 --env-file C:\Users\Dell\Downloads\.env.prod --name my-ai-app truongkd4/docker-ai-app:1.0

                        </li>
                    </ol>
                    
                </div>
                <div className="modal-footer">
                    <button type="button" onClick={() => setIsReadmeOpen(false)} className="btn btn-primary" data-bs-dismiss="modal">Đã hiểu</button>
                </div>
            </div>
        </div>
    </div>
    );
}