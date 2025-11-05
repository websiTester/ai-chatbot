"use client";
 
import { useState } from "react";
import { getAnalysisMarkdown, getStreamingMarkdown, getWeatherInfo } from "./action";
 
// export function Form() {
//   const [result, setResult] = useState<string | null>(null);
 
//   async function handleSubmit(formData: FormData) {
//     const res = await getWeatherInfo(formData);
//     setResult(res);
//   }
 
//   return (
//     <>
//       <form action={handleSubmit}>
//         <input name="city" placeholder="Enter city" required />
//         <button type="submit">Get Weather</button>
//       </form>
//       {result && <pre>{result}</pre>}
//     </>
//   );
// }


export function Form() {
  const [result, setResult] = useState<string | null>(null);
 
  async function handleSubmit(formData: FormData) {
    const res = await getAnalysisMarkdown(formData);
    setResult(res);
  }
 
  return (
    <>
      <form action={handleSubmit}>
        <input name="functionName" placeholder="Enter function name" required />
        <button type="submit">Get Analysis</button>
      </form>
      {result && <pre>{result}</pre>}
    </>
  );
}