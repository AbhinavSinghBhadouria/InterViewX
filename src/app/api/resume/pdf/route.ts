import { NextResponse } from "next/server";
import { chromium } from "playwright";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import db from "@/src/lib/prisma";

export async function POST() {
  //checking if the user is authenticated or not
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //check if resume exists
  const user = await db.user.findUnique({
    where: { authUserId: session.user._id },
    include: { resume: true },
  });

  if (!user?.resume) {
    return NextResponse.json({ error: "No resume found" }, { status: 404 });
  }

  let browser;
  try {
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Convert markdown to HTML if needed
    let htmlContent = user.resume.content;
    
    // If content is markdown, convert it to HTML
    if (htmlContent && !htmlContent.includes('<')) {
      const { marked } = await import("marked");
      htmlContent = await marked(htmlContent);
    }

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            line-height: 1.6;
            color: #000;
            background: #fff;
          }
          h1, h2, h3 { 
            margin-top: 16px; 
            color: #000;
          }
          h1 { font-size: 24px; }
          h2 { font-size: 20px; }
          h3 { font-size: 18px; }
          p { margin: 8px 0; }
          ul, ol { margin: 8px 0; padding-left: 24px; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" },
    });

    await browser.close();

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    if (browser) {
      await browser.close().catch(() => {});
    }
    return NextResponse.json(
      { error: `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
