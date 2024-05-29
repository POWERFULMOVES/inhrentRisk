import { create_print_out_prompt } from "@/models/prompt_structure";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    // const code_data= {code: "NRA",
    // riskCategory: "NRA Customers",
    // lowRisk: "The institution does not have any NRA accounts.",
    // moderateRisk:
    //   "Moderate level of NRA accounts from lower- risk geographies.",
    // highRisk:
    //   "Significant number of NRA accounts from higher-risk geographies.",}
    const body = await req.json();

    const res = await axios.post("http://localhost:11434/api/generate", {
      model: "AnalysisPrintOut",
      prompt: body.prompt,
      stream: false,
      options: { num_ctx: 10000, temperature: 0 },
    });

    const data = await res.data;
    const response = data.response;

    fs.writeFileSync(
      `public/files/${body.bankName.replaceAll(" ", "")}_PrintOut.txt`,
      response
    );

    // const doc = new jsPDF();
    // // add your content to the document here, as usual

    // const pdf = new PDFKit();
    // pdf.text(response);
    // pdf.pipe(fs.createWriteStream("text-file.pdf"));
    // pdf.end();
    // const pdf = new jsPDF();
    // pdf.text(response, 10, 10);
    // pdf.save(`public/files/${body.bankName.replaceAll(" ", "")}_PrintOut.pdf`);
    // get a blob when you're done
    // doc.pipe(fs.createWriteStream(`public/files/${body.bankName.replaceAll(" ", "")}_PrintOut.pdf`));
    // doc.end();
    // console.log(data);

    const r = NextResponse.json({ response });
    r.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
    r.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    r.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return r;
  } catch (error) {
    console.log(error);
    return NextResponse.json(null);
  }
}

export const OPTIONS = () => {
  const response = NextResponse.json({});
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
};
