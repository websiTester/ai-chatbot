"use client";
 
import { useState } from "react";
import { getObsidianResponse } from "./action";


export function Form() {
  const [result, setResult] = useState<string | null>(null);
 
  async function handleSubmit(formData: FormData) {
    const res = await getObsidianResponse(formData);
    setResult(res);
  }
 
  return (
    <>
      <form action={handleSubmit}>
        <input name="request" placeholder="Enter request" required />
        <button type="submit">Get Response</button>
      </form>
      {result && <pre>{result}</pre>}
    </>
  );
}